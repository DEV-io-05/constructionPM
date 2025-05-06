import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import SessionManager from '../utils/sessionManager.js';

const router = express.Router();

router.get('/active', verifyToken, async (req, res, next) => {
  try {
    const sessions = await SessionManager.getActiveSessions(req.user.id);
    res.json({ sessions });
  } catch (error) {
    next(error);
  }
});

router.delete('/other', verifyToken, async (req, res, next) => {
  try {
    await SessionManager.invalidateOtherSessions(req.user.id, req.headers.authorization);
    res.json({ message: 'Other sessions terminated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:sessionId', verifyToken, async (req, res, next) => {
  try {
    await SessionManager.terminateSession(req.params.sessionId, req.user.id);
    res.json({ message: 'Session terminated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;