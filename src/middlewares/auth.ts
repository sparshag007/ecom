import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import { RequestUser } from 'types/requestuser';

// Middleware to check if JWT token is valid and attached to the request
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer header
  if (!token) {
    res.status(401).json({ message: 'Access denied, token missing' });
    return;
  }

  try {
    const decoded = verifyToken(token); // Verify the token
    req.user = decoded; // Attach the decoded token to the request
    next(); // Proceed to the next middleware or route
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Role-based Authorization Middleware (AuthZ)
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) : void => {
    const user = req.user as RequestUser;
    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'Access denied, insufficient privileges' });
      return;
    }
    next();
  };
};
