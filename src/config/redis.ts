import Redis from 'ioredis';
import { env } from './env';

let redis: Redis;

try {
  redis = new Redis(env.REDIS_URL, {
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy: () => null,
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected');
  });

  redis.on('error', (error) => {
    console.error('⚠️ Redis not available:', error.message);
  });
} catch (error) {
  console.error('⚠️ Redis initialization failed');
}

export default redis!;
