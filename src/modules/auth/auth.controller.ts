import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerService(name, email, password);
    res.status(201).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyEmailService(email, otp);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginService(email, password);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokenService(refreshToken);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPasswordService(email);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPasswordService(email, otp, newPassword);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await authService.logoutService(req.userId!);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};
