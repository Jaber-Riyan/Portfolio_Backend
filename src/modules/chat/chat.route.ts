import { Router } from 'express';
import express from 'express';
import { validate } from '../../shared/middleware/validate';
import {
  startSession,
  sendMessage,
  endSession,
  heartbeat,
  beaconEndSession,
  getSession,
} from './chat.controller';
import {
  startSessionSchema,
  sendMessageSchema,
  endSessionSchema,
  heartbeatSchema,
} from './chat.validation';

const router = Router();

router.post('/start-session', validate(startSessionSchema), startSession);
router.post('/message', validate(sendMessageSchema), sendMessage);
router.post('/end-session', validate(endSessionSchema), endSession);
router.post('/heartbeat', validate(heartbeatSchema), heartbeat);

// navigator.sendBeacon() may send text/plain or application/json.
// The text() middleware catches text/plain bodies that express.json() skips.
router.post('/beacon', express.text({ type: 'text/plain' }), beaconEndSession);

router.get('/session/:sessionId', getSession);

export const ChatRoutes = router;
