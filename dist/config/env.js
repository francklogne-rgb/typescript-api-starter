"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    PORT: process.env.PORT || '3000',
    MONGO_URL: process.env.MONGO_URL || '',
    REDIS_URL: process.env.REDIS_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'smtp',
    EMAIL_API_KEY: process.env.EMAIL_API_KEY || '',
    EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@example.com',
    OTP_EXPIRES_IN: parseInt(process.env.OTP_EXPIRES_IN || '600'),
};
