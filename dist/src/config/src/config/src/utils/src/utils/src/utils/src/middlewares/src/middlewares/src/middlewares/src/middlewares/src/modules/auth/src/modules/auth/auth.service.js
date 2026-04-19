"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutService = exports.resetPasswordService = exports.forgotPasswordService = exports.refreshTokenService = exports.loginService = exports.verifyEmailService = exports.registerService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_model_1 = require("./auth.model");
const jwt_1 = require("../../utils/jwt");
const otp_1 = require("../../utils/otp");
const email_1 = require("../../utils/email");
const error_middleware_1 = require("../../middlewares/error.middleware");
const redis_1 = __importDefault(require("../../config/redis"));
const registerService = async (name, email, password) => {
    const existing = await auth_model_1.User.findOne({ email });
    if (existing)
        throw (0, error_middleware_1.createError)('Email already in use', 400);
    const hashed = await bcryptjs_1.default.hash(password, 12);
    const user = await auth_model_1.User.create({ name, email, password: hashed });
    const otp = (0, otp_1.generateOTP)();
    await (0, otp_1.saveOTP)(email, otp);
    await (0, email_1.sendEmail)({
        to: email,
        subject: 'Verify your email',
        html: (0, email_1.otpEmailTemplate)(otp),
    });
    return { message: 'Registration successful. Check your email for OTP.' };
};
exports.registerService = registerService;
const verifyEmailService = async (email, otp) => {
    const valid = await (0, otp_1.verifyOTP)(email, otp);
    if (!valid)
        throw (0, error_middleware_1.createError)('Invalid or expired OTP', 400);
    await auth_model_1.User.findOneAndUpdate({ email }, { isVerified: true });
    return { message: 'Email verified successfully' };
};
exports.verifyEmailService = verifyEmailService;
const loginService = async (email, password) => {
    const user = await auth_model_1.User.findOne({ email });
    if (!user)
        throw (0, error_middleware_1.createError)('Invalid credentials', 401);
    if (!user.isVerified)
        throw (0, error_middleware_1.createError)('Please verify your email first', 401);
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match)
        throw (0, error_middleware_1.createError)('Invalid credentials', 401);
    const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
    const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
    await redis_1.default.setex(`refresh:${user._id}`, 7 * 24 * 60 * 60, refreshToken);
    return { accessToken, refreshToken };
};
exports.loginService = loginService;
const refreshTokenService = async (refreshToken) => {
    const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
    const stored = await redis_1.default.get(`refresh:${decoded.userId}`);
    if (!stored || stored !== refreshToken)
        throw (0, error_middleware_1.createError)('Invalid refresh token', 401);
    const accessToken = (0, jwt_1.generateAccessToken)(decoded.userId);
    return { accessToken };
};
exports.refreshTokenService = refreshTokenService;
const forgotPasswordService = async (email) => {
    const user = await auth_model_1.User.findOne({ email });
    if (!user)
        throw (0, error_middleware_1.createError)('User not found', 404);
    const otp = (0, otp_1.generateOTP)();
    await (0, otp_1.saveOTP)(`reset:${email}`, otp);
    await (0, email_1.sendEmail)({
        to: email,
        subject: 'Reset your password',
        html: (0, email_1.resetPasswordTemplate)(otp),
    });
    return { message: 'Reset code sent to your email' };
};
exports.forgotPasswordService = forgotPasswordService;
const resetPasswordService = async (email, otp, newPassword) => {
    const valid = await (0, otp_1.verifyOTP)(`reset:${email}`, otp);
    if (!valid)
        throw (0, error_middleware_1.createError)('Invalid or expired OTP', 400);
    const hashed = await bcryptjs_1.default.hash(newPassword, 12);
    await auth_model_1.User.findOneAndUpdate({ email }, { password: hashed });
    return { message: 'Password reset successfully' };
};
exports.resetPasswordService = resetPasswordService;
const logoutService = async (userId) => {
    await redis_1.default.del(`refresh:${userId}`);
    return { message: 'Logged out successfully' };
};
exports.logoutService = logoutService;
