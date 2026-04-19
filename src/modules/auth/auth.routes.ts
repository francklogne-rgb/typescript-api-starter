import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { rateLimit } from '../../middlewares/rateLimit.middleware';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const otpSchema = z.object({ email: z.string().email(), otp: z.string().length(6) });
const forgotSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({ email: z.string().email(), otp: z.string().length(6), newPassword: z.string().min(8) });
const refreshSchema = z.object({ refreshToken: z.string() });

router.post('/register', rateLimit({ windowSeconds: 60, maxRequests: 5 }), validate(registerSchema), authController.register);
router.post('/verify-email', validate(otpSchema), authController.verifyEmail);
router.post('/login', rateLimit({ windowSeconds: 60, maxRequests: 10 }), validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refreshToken);
router.post('/forgot-password', rateLimit({ windowSeconds: 60, maxRequests: 3 }), validate(forgotSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetSchema), authController.resetPassword);
router.post('/logout', authenticate, authController.logout);

export default router;
