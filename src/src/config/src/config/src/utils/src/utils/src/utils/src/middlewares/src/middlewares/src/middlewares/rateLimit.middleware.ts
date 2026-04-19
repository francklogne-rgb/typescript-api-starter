import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

interface RateLimitOptions {
  windowSeconds: number;
  maxRequests: number;
}

export const rateLimit = (options: RateLimitOptions) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `ratelimit:${ip}:${req.path}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, options.windowSeconds);
    }

    if (current > options.maxRequests) {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
      return;
    }

    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader(
      'X-RateLimit-Remaining',
      Math.max(0, options.maxRequests - current)
    );

    next();
  };
};
