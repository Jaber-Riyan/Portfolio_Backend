import mongoose, { Schema } from 'mongoose';
import { IChatSessionDocument } from './chat.interface';
import { SESSION_TTL_DAYS } from './chat.constant';

const deviceInfoSchema = new Schema(
  {
    browser: { type: String, default: '' },
    os: { type: String, default: '' },
    deviceType: { type: String, default: '' },
    language: { type: String, default: '' },
    networkProviderName: { type: String, default: '' },
    screenWidth: { type: Number, default: 0 },
    screenHeight: { type: Number, default: 0 },
  },
  { _id: false },
);

const chatSessionSchema = new Schema<IChatSessionDocument>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    deviceId: { type: String, required: true, index: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
    totalMessages: { type: Number, default: 0 },
    totalTokensUsed: { type: Number, default: 0 },
    durationSeconds: { type: Number, default: 0 },
    deviceInfo: { type: deviceInfoSchema, default: () => ({}) },
    lastHeartbeat: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// TTL index: MongoDB Atlas automatically removes sessions after SESSION_TTL_DAYS days.
// expireAfterSeconds: 0 means the document expires exactly at the expiresAt date.
chatSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SESSION_EXPIRY_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;

export const ChatSessionModel = mongoose.model<IChatSessionDocument>(
  'ChatSession',
  chatSessionSchema,
  'chat_sessions', // explicit collection name as required
);
