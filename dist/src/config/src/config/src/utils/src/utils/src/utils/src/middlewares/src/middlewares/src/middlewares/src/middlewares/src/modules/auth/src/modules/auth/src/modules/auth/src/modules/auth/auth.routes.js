"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("./auth.controller"));
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rateLimit_middleware_1 = require("../../middlewares/rateLimit.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const otpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().length(6),
});
const forgotSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const resetSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().length(6),
    newPassword: zod_1.z.string().min(8),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
router.post('/register', (0, rateLimit_middleware_1.rateLimit)({ windowSeconds: 60, maxRequests: 5 }), (0, validate_middleware_1.validate)(registerSchema), authController.register);
router.post('/verify-email', (0, validate_middleware_1.validate)(otpSchema), authController.verifyEmail);
router.post('/login', (0, rateLimit_middleware_1.rateLimit)({ windowSeconds: 60, maxRequests: 10 }), (0, validate_middleware_1.validate)(loginSchema), authController.login);
router.post('/refresh', (0, validate_middleware_1.validate)(refreshSchema), authController.refreshToken);
router.post('/forgot-password', (0, rateLimit_middleware_1.rateLimit)({ windowSeconds: 60, maxRequests: 3 }), (0, validate_middleware_1.validate)(forgotSchema), authController.forgotPassword);
router.post('/reset-password', (0, validate_middleware_1.validate)(resetSchema), authController.resetPassword);
router.post('/logout', auth_middleware_1.authenticate, authController.logout);
exports.default = router;
