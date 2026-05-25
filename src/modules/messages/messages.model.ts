import mongoose, { Schema } from 'mongoose';
import { IMessageDocument } from './messages.interface';

const messageSchema = new Schema<IMessageDocument>(
  {
    senderName: { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, default: 'No subject', trim: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

messageSchema.index({ read: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 24 * 60 * 60 }); // TTL: 15 days

export const MessageModel = mongoose.model<IMessageDocument>('Message', messageSchema);
