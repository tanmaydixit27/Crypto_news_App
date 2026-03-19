import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase.js';

export interface AuthRequest extends Request {
  user?: { uid: string; email: string };
}

export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.user = { uid: decoded.uid, email: decoded.email! };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};