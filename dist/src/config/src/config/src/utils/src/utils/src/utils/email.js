"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordTemplate = exports.otpEmailTemplate = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const getTransporter = () => {
    if (env_1.env.EMAIL_PROVIDER === 'resend') {
        return nodemailer_1.default.createTransport({
            host: 'smtp.resend.com',
            port: 465,
            secure: true,
            auth: {
                user: 'resend',
                pass: env_1.env.EMAIL_API_KEY,
            },
        });
    }
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
        },
    });
};
const sendEmail = async (options) => {
    const transporter = getTransporter();
    await transporter.sendMail({
        from: env_1.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
};
exports.sendEmail = sendEmail;
const otpEmailTemplate = (otp) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verification Code</h2>
      <p>Your verification code is:</p>
      <h1 style="color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;
};
exports.otpEmailTemplate = otpEmailTemplate;
const resetPasswordTemplate = (otp) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>Your password reset code is:</p>
      <h1 style="color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;
};
exports.resetPasswordTemplate = resetPasswordTemplate;
