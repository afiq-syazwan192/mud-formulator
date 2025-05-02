import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt';
import { User, IUser } from '../models/User';

interface JwtPayload {
  userId: string;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = JWT_CONFIG.getToken(req);

    if (!token) {
      res.status(401).json({ error: 'No token, authorization denied' });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_CONFIG.secret) as JwtPayload;
      User.findById(decoded.userId)
        .select('-password')
        .then(user => {
          if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
          }
          req.user = user;
          next();
        })
        .catch(err => {
          console.error('Auth middleware error:', err);
          res.status(500).json({ error: 'Server error' });
        });
    } catch (err) {
      res.status(401).json({ error: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export default auth; 