import { Document } from 'mongoose';

export interface IDeviceInfo {
  browser: string;
  os: string;
  deviceType: string;
  language: string;
  networkProviderName: string;
  screenWidth: number;
  screenHeight: number;
}

export interface IChatSession {
  sessionId: string;
  deviceId: string;
  startedAt: Date;
  endedAt?: Date;
  isActive: boolean;
  totalMessages: number;
  totalTokensUsed: number;
  durationSeconds: number;
  deviceInfo: IDeviceInfo;
  lastHeartbeat: Date;
  expiresAt: Date;
}

export interface IChatSessionDocument extends IChatSession, Document {
  createdAt: Date;
  updatedAt: Date;
}

export type MessageRole = 'user' | 'assistant';

export interface IChatMessage {
  sessionId: string;
  role: MessageRole;
  content: string;
  expiresAt: Date;
}

export interface IChatMessageDocument extends IChatMessage, Document {
  createdAt: Date;
}
