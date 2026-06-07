import mongoose, { Schema } from 'mongoose';
import { IChatMessageDocument } from './chat.interface';
import { MESSAGE_TTL_HOURS } from './chat.constant';

const chatMessageSchema = new Schema<IChatMessageDocument>(
  {
    sessionId: { type: String, required: true, index: true },
    role: { type: String, required: true, enum: ['user', 'assistant'] },
    content: { type: String, required: true },
    // expiresAt drives the TTL index — messages self-delete after 24 hours.
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// TTL index: MongoDB removes messages exactly when expiresAt is reached.
chatMessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export const MESSAGE_EXPIRY_MS = MESSAGE_TTL_HOURS * 60 * 60 * 1000;

export const ChatMessageModel = mongoose.model<IChatMessageDocument>(
  'ChatMessage',
  chatMessageSchema,
  'chat_messages', // explicit collection name as required
);
