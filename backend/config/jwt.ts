import dotenv from 'dotenv';
import { Secret, SignOptions } from 'jsonwebtoken';

dotenv.config();

type ExpiresIn = SignOptions['expiresIn'];

interface JwtConfig {
  secret: Secret;
  expiresIn: ExpiresIn;
  getToken: (req: any) => string | null;
}

export const JWT_CONFIG: JwtConfig = {
  secret: (process.env.JWT_SECRET || 'mud-formulator-secret-key-2024') as Secret,
  expiresIn: '7d',
  getToken: (req: any) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
}; 