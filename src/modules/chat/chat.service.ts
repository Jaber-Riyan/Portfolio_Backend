import { randomUUID } from 'crypto';
import { ChatSessionModel, SESSION_EXPIRY_MS } from './chatSession.model';
import { ChatMessageModel, MESSAGE_EXPIRY_MS } from './chatMessage.model';
import { IChatSessionDocument, IDeviceInfo } from './chat.interface';
import { getEmbedding } from '../ai/embed';
import { knowledgeService } from '../knowledge/knowledge.service';
import { aion } from '../ai/aion';
import { ApiError } from '../../shared/errors/ApiError';
import { logger } from '../../shared/logger/logger';
import { sendMail } from '../../core/mail/mailer';
import { sessionEndedTemplate } from '../../core/mail/templates/sessionEnded';
import { env } from '../../config/env';
import { HEARTBEAT_TIMEOUT_MS } from './chat.constant';

// ---------------------------------------------------------------------------
// System prompt for the RAG-powered portfolio assistant.
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are Jaber Ahmed Riyan's AI Portfolio Assistant.

Answer only using the provided portfolio information.
Never invent information.
Never hallucinate.
If information is unavailable, politely state that you do not have enough portfolio information to answer that question.
Do not mention context, embeddings, vector search, documents, or internal systems.
Keep your answers concise, helpful, and professional.`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cleanResponse(text: string): string {
  // Strip any reasoning tags some models may emit
  return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

function makeSessionExpiry(): Date {
  return new Date(Date.now() + SESSION_EXPIRY_MS);
}

function makeMessageExpiry(): Date {
  return new Date(Date.now() + MESSAGE_EXPIRY_MS);
}

// ---------------------------------------------------------------------------
// ChatService
// ---------------------------------------------------------------------------

export interface SendMessageResult {
  answer: string;
  sessionId: string;
}

export interface SessionWithMessages {
  session: IChatSessionDocument;
  messages: Array<{ role: string; content: string; createdAt: Date }>;
}

class ChatService {
  /**
   * Creates a new session for a device.
   * If the device already has a fresh active session (heartbeat < 5 min ago),
   * that session is reused instead of creating a duplicate.
   */
  async startSession(deviceId: string, deviceInfo: Partial<IDeviceInfo>): Promise<IChatSessionDocument> {
    const existingActive = await ChatSessionModel.findOne({ deviceId, isActive: true }).sort({
      createdAt: -1,
    });

    if (existingActive) {
      const heartbeatAge = Date.now() - existingActive.lastHeartbeat.getTime();
      if (heartbeatAge < HEARTBEAT_TIMEOUT_MS) {
        // Session is still alive — return it as-is
        return existingActive;
      }
      // Heartbeat expired: silently close the stale session before opening a new one
      await this.closeSession(existingActive, true);
    }

    const session = await ChatSessionModel.create({
      sessionId: randomUUID(),
      deviceId,
      deviceInfo: deviceInfo ?? {},
      startedAt: new Date(),
      isActive: true,
      expiresAt: makeSessionExpiry(),
      lastHeartbeat: new Date(),
    });

    logger.info(`[Chat] Session started — ${session.sessionId} (device: ${deviceId})`);
    return session;
  }

  /**
   * Core RAG pipeline:
   * user message → embed → Atlas vector search → build context → Aion API → response
   */
  async sendMessage(
    sessionId: string,
    deviceId: string,
    userMessage: string,
  ): Promise<SendMessageResult> {
    const session = await ChatSessionModel.findOne({ sessionId, deviceId });
    if (!session) throw ApiError.notFound('Chat session not found');
    if (!session.isActive) throw ApiError.badRequest('This chat session has already ended');

    const now = new Date();

    // Auto-close if the heartbeat window has elapsed
    if (now.getTime() - session.lastHeartbeat.getTime() > HEARTBEAT_TIMEOUT_MS) {
      await this.closeSession(session, true);
      throw ApiError.badRequest('Session expired due to inactivity. Please start a new session.');
    }

    const msgExpiry = makeMessageExpiry();

    // Persist the user's message
    await ChatMessageModel.create({
      sessionId,
      role: 'user',
      content: userMessage,
      expiresAt: msgExpiry,
    });

    // --- RAG Pipeline ---
    const queryEmbedding = await getEmbedding(userMessage);
    const relevantChunks = await knowledgeService.vectorSearch(queryEmbedding, 5);

    const context =
      relevantChunks.length > 0
        ? relevantChunks.map((c) => `[${c.title}]\n${c.content}`).join('\n\n---\n\n')
        : 'No portfolio information is currently available.';

    const completion = await aion.chat.completions.create({
      model: 'aion-labs/aion-1.0-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Portfolio Context:\n${context}\n\n---\n\nQuestion: ${userMessage}`,
        },
      ],
    });

    const raw =
      completion.choices[0]?.message?.content ??
      "I don't have enough portfolio information to answer that question.";

    const answer = cleanResponse(raw);
    const tokensUsed = completion.usage?.total_tokens ?? 0;

    // Persist the assistant's response
    await ChatMessageModel.create({
      sessionId,
      role: 'assistant',
      content: answer,
      expiresAt: msgExpiry,
    });

    // Update session analytics atomically
    await ChatSessionModel.findByIdAndUpdate(session._id, {
      $inc: { totalMessages: 2, totalTokensUsed: tokensUsed },
      lastHeartbeat: now,
    });

    logger.info(`[Chat] Message processed — session ${sessionId} (+${tokensUsed} tokens)`);

    return { answer, sessionId };
  }

  /**
   * Explicitly close a session (triggered by API or beacon).
   * Idempotent — closing an already-ended session is a no-op.
   */
  async endSession(sessionId: string, deviceId: string): Promise<void> {
    const session = await ChatSessionModel.findOne({ sessionId, deviceId });
    if (!session || !session.isActive) return; // Already ended — idempotent
    await this.closeSession(session, false);
  }

  /**
   * Update the last-heartbeat timestamp.
   * Called every 60 seconds from the frontend.
   */
  async heartbeat(sessionId: string, deviceId: string): Promise<void> {
    const session = await ChatSessionModel.findOne({ sessionId, deviceId, isActive: true });
    if (!session) return; // Silently ignore stale heartbeats
    await ChatSessionModel.findByIdAndUpdate(session._id, {
      lastHeartbeat: new Date(),
    });
  }

  async getSession(sessionId: string): Promise<SessionWithMessages | null> {
    const session = await ChatSessionModel.findOne({ sessionId });
    if (!session) return null;
    const messages = await ChatMessageModel.find({ sessionId })
      .sort({ createdAt: 1 })
      .select('-expiresAt')
      .lean<Array<{ role: string; content: string; createdAt: Date }>>();
    return { session, messages };
  }

  /**
   * Sweep stale sessions whose heartbeat has exceeded the timeout window.
   * Called on a 60-second interval from the server startup routine.
   */
  async cleanupStaleSessions(): Promise<void> {
    const cutoff = new Date(Date.now() - HEARTBEAT_TIMEOUT_MS);
    const stale = await ChatSessionModel.find({
      isActive: true,
      lastHeartbeat: { $lt: cutoff },
    });

    for (const session of stale) {
      await this.closeSession(session, true);
    }

    if (stale.length > 0) {
      logger.info(`[Chat] Cleaned up ${stale.length} stale session(s)`);
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async closeSession(session: IChatSessionDocument, isAbandoned: boolean): Promise<void> {
    const now = new Date();
    const durationSeconds = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);

    await ChatSessionModel.findByIdAndUpdate(session._id, {
      isActive: false,
      endedAt: now,
      durationSeconds,
    });

    logger.info(
      `[Chat] Session closed — ${session.sessionId} | ${durationSeconds}s | ${session.totalMessages} messages | abandoned=${isAbandoned}`,
    );

    // Send session summary email for explicit closes (not heartbeat-timeout cleanup)
    if (!isAbandoned && env.notifyEmail) {
      this.dispatchSessionEmail(session, durationSeconds).catch((err) => {
        logger.error('[Chat] Failed to send session email:', err);
      });
    }
  }

  private async dispatchSessionEmail(
    session: IChatSessionDocument,
    durationSeconds: number,
  ): Promise<void> {
    const messages = await ChatMessageModel.find({ sessionId: session.sessionId })
      .sort({ createdAt: 1 })
      .lean<Array<{ role: string; content: string; createdAt: Date }>>();

    await sendMail({
      to: env.notifyEmail,
      subject: `Portfolio Chat Ended — ${new Date().toLocaleDateString()} — ${session.totalMessages} messages`,
      html: sessionEndedTemplate(session, messages, durationSeconds),
    });
  }
}

export const chatService = new ChatService();
