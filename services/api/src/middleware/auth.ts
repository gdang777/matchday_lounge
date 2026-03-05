import { Request, Response, NextFunction } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '../lib/firebase';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

// Extracts and verifies the Firebase ID token from the Authorization header.
// Attaches the decoded token to req.user on success.
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }
  try {
    req.user = await auth.verifyIdToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Like requireAuth but also enforces the `admin` custom claim.
// Custom claims are set via Cloud Run when an admin role is assigned.
export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }
  try {
    req.user = await auth.verifyIdToken(header.slice(7));
    if (!req.user.admin) {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Attaches req.user if a valid token is present, but does not reject anonymous callers.
// Use for endpoints that work for both signed-in and anonymous users
// (e.g. GET public listings, POST flag-promotion).
export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.user = await auth.verifyIdToken(header.slice(7));
    } catch {
      // Bad token — proceed anonymously, don't block the request.
    }
  }
  next();
}
