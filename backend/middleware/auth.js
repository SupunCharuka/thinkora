import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

// Auth middleware: verifies JWT from Authorization header or cookies.
// Attaches `req.user` (full payload) and `req.userId` for compatibility.
export default function authMiddleware(req, res, next) {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  // Read Authorization header (case-insensitive) and normalize
  const rawAuth = (req.headers.authorization || req.headers.Authorization || '').toString();
  let token = null;

  if (rawAuth) {
    const parts = rawAuth.split(' ').filter(Boolean);
    // Accept: "Bearer <token>" (case-insensitive) or a single token string
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    } else if (parts.length === 1) {
      token = parts[0];
    }
  }

  // Fallback to cookie `token` when available
  if (!token && req.cookies && typeof req.cookies.token === 'string') {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    if (payload && payload.id) req.userId = payload.id;
    return next();
  } catch (err) {
    if (err && err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (err && err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Unexpected JWT error:', err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
}
