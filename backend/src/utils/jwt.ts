import jwt from 'jsonwebtoken';
import { UserData } from '../services/user.service';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: string;
}

export interface JwtUserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export const signToken = (user: JwtUserData | UserData): string => {
  const payload: JwtPayload = {
    userId: user.id,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}; 