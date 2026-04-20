import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export const generateAccessToken = (userId: string): string => {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as string };
  return jwt.sign({ userId }, env.JWT_SECRET as string, options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN as string };
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET as string, options);
};

export const verifyAccessToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.JWT_SECRET as string) as { userId: string };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET as string) as { userId: string };
};
