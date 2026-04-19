"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const rateLimit = (options) => {
    return async (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const key = `ratelimit:${ip}:${req.path}`;
        const current = await redis_1.default.incr(key);
        if (current === 1) {
            await redis_1.default.expire(key, options.windowSeconds);
        }
        if (current > options.maxRequests) {
            res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.',
            });
            return;
        }
        res.setHeader('X-RateLimit-Limit', options.maxRequests);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - current));
        next();
    };
};
exports.rateLimit = rateLimit;
