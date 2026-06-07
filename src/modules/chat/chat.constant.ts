export const CHAT_MESSAGES = {
  SESSION_STARTED: 'Chat session started',
  SESSION_ENDED: 'Chat session ended',
  SESSION_FETCHED: 'Chat session fetched',
  MESSAGE_SENT: 'Message sent successfully',
  HEARTBEAT_OK: 'Heartbeat received',
};

export const SESSION_TTL_DAYS = 60;
export const MESSAGE_TTL_HOURS = 24;

// If no heartbeat received within this window, session is considered abandoned
export const HEARTBEAT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
