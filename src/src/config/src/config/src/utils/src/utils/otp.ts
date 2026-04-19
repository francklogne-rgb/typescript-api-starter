import redis from '../config/redis';
import { env } from '../config/env';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const saveOTP = async (
  email: string,
  otp: string
): Promise<void> => {
  await redis.setex(
    `otp:${email}`,
    env.OTP_EXPIRES_IN,
    otp
  );
};

export const verifyOTP = async (
  email: string,
  otp: string
): Promise<boolean> => {
  const stored = await redis.get(`otp:${email}`);
  if (!stored || stored !== otp) return false;
  await redis.del(`otp:${email}`);
  return true;
};
