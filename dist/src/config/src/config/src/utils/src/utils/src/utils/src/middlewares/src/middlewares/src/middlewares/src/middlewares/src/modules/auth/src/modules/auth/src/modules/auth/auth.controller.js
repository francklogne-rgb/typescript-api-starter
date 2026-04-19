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
exports.logout = exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.login = exports.verifyEmail = exports.register = void 0;
const authService = __importStar(require("./auth.service"));
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const result = await authService.registerService(name, email, password);
        res.status(201).json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await authService.verifyEmailService(email, otp);
        res.status(200).json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyEmail = verifyEmail;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginService(email, password);
        res.status(200).json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshTokenService(refreshToken);
        res.status(200).json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPasswordService(email);
        res.status(200).json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        const result = await authService.resetPasswordService(email, otp, newPassword);
        res.status(200).json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
const logout = async (req, res, next) => {
    try {
        const result = await authService.logoutService(req.userId);
        res.status(200).json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
