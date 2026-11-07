import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { httpError } from '../utils/httpError.js';

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(httpError(401, 'Authentication required'));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.id };
    next();
  } catch {
    next(httpError(401, 'Invalid or expired token'));
  }
}
