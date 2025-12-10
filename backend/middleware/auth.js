import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

// Simple auth middleware: verifies JWT in Authorization header.
// If valid, attaches `req.userId`. If invalid or missing, responds 401.
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
