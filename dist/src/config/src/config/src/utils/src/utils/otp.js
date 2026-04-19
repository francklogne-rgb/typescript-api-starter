"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.saveOTP = exports.generateOTP = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const env_1 = require("../config/env");
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const saveOTP = async (email, otp) => {
    await redis_1.default.setex(`otp:${email}`, env_1.env.OTP_EXPIRES_IN, otp);
};
exports.saveOTP = saveOTP;
const verifyOTP = async (email, otp) => {
    const stored = await redis_1.default.get(`otp:${email}`);
    if (!stored || stored !== otp)
        return false;
    await redis_1.default.del(`otp:${email}`);
    return true;
};
exports.verifyOTP = verifyOTP;
