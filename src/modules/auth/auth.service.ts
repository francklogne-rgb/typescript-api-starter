import bcrypt from 'bcryptjs';
import { User } from './auth.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { generateOTP, saveOTP, verifyOTP } from '../../utils/otp';
import { sendEmail, otpEmailTemplate, resetPasswordTemplate } from '../../utils/email';
import { createError } from '../../middlewares/error.middleware';
import redis from '../../config/redis';

export const registerService = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) throw createError('Email already in use', 400);
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });
  const otp = generateOTP();
  await saveOTP(email, otp);
  await sendEmail({ to: email, subject: 'Verify your email', html: otpEmailTemplate(otp) });
  return { message: 'Registration successful. Check your email for OTP.' };
};

export const verifyEmailService = async (email: string, otp: string) => {
  const valid = await verifyOTP(email, otp);
  if (!valid) throw createError('Invalid or expired OTP', 400);
  await User.findOneAndUpdate({ email }, { isVerified: true });
  return { message: 'Email verified successfully' };
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw createError('Invalid credentials', 401);
  if (!user.isVerified) throw createError('Please verify your email first', 401);
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw createError('Invalid credentials', 401);
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  await redis.setex(`refresh:${user._id}`, 7 * 24 * 60 * 60, refreshToken);
  return { accessToken, refreshToken };
};

export const refreshTokenService = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  const stored = await redis.get(`refresh:${decoded.userId}`);
  if (!stored || stored !== refreshToken) throw createError('Invalid refresh token', 401);
  const accessToken = generateAccessToken(decoded.userId);
  return { accessToken };
};

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw createError('User not found', 404);
  const otp = generateOTP();
  await saveOTP(`reset:${email}`, otp);
  await sendEmail({ to: email, subject: 'Reset your password', html: resetPasswordTemplate(otp) });
  return { message: 'Reset code sent to your email' };
};

export const resetPasswordService = async (email: string, otp: string, newPassword: string) => {
  const valid = await verifyOTP(`reset:${email}`, otp);
  if (!valid) throw createError('Invalid or expired OTP', 400);
  const hashed = await bcrypt.hash(newPassword, 12);
  await User.findOneAndUpdate({ email }, { password: hashed });
  return { message: 'Password reset successfully' };
};

export const logoutService = async (userId: string) => {
  await redis.del(`refresh:${userId}`);
  return { message: 'Logged out successfully' };
};
