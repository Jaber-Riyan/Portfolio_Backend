import { Request, Response } from 'express';
import { chatService } from './chat.service';
import { CHAT_MESSAGES } from './chat.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { ApiError } from '../../shared/errors/ApiError';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const startSession = catchAsync(async (req: Request, res: Response) => {
  const { deviceId, deviceInfo } = req.body;
  const session = await chatService.startSession(deviceId, deviceInfo);
  ApiResponse.created(res, CHAT_MESSAGES.SESSION_STARTED, { sessionId: session.sessionId });
});

export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { sessionId, deviceId, message } = req.body;
  const result = await chatService.sendMessage(sessionId, deviceId, message);
  ApiResponse.success(res, CHAT_MESSAGES.MESSAGE_SENT, result);
});

export const endSession = catchAsync(async (req: Request, res: Response) => {
  const { sessionId, deviceId } = req.body;
  await chatService.endSession(sessionId, deviceId);
  ApiResponse.success(res, CHAT_MESSAGES.SESSION_ENDED, null);
});

export const heartbeat = catchAsync(async (req: Request, res: Response) => {
  const { sessionId, deviceId } = req.body;
  await chatService.heartbeat(sessionId, deviceId);
  ApiResponse.success(res, CHAT_MESSAGES.HEARTBEAT_OK, null);
});

/**
 * Beacon endpoint — called via navigator.sendBeacon() when the browser tab closes.
 * Must respond with 204 immediately before doing any async work, because the
 * browser may not wait for a full response on page unload.
 */
export const beaconEndSession = async (req: Request, res: Response): Promise<void> => {
  res.sendStatus(204); // Respond immediately — the browser won't wait longer

  try {
    // Beacon may arrive as text/plain (raw string) or application/json (parsed object)
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { sessionId, deviceId } = (body as { sessionId?: string; deviceId?: string }) ?? {};
    if (sessionId && deviceId) {
      await chatService.endSession(sessionId, deviceId);
    }
  } catch {
    // Fire-and-forget — swallow all errors silently
  }
};

export const getSession = catchAsync(async (req: Request, res: Response) => {
  const result = await chatService.getSession(req.params.sessionId);
  if (!result) throw ApiError.notFound('Chat session not found');
  ApiResponse.success(res, CHAT_MESSAGES.SESSION_FETCHED, result);
});
