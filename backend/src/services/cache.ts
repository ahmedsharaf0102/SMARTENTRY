import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

let redis: Redis | null = null;

/**
 * Get Redis client instance (singleton)
 * Returns null if Redis is unavailable (graceful degradation)
 */
export function getRedis(): Redis | null {
  if (!redis) {
    try {
      redis = new Redis(config.redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) return null; // Stop retrying
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
      });

      redis.on('error', (err) => {
        logger.warn('Redis connection error (operating without cache):', err.message);
      });

      redis.on('connect', () => {
        logger.info('Redis connected');
      });

      redis.connect().catch(() => {
        logger.warn('Redis unavailable — running without cache');
        redis = null;
      });
    } catch {
      logger.warn('Redis initialization failed — running without cache');
      redis = null;
    }
  }
  return redis;
}

/**
 * Get cached value or execute the getter function
 */
export async function getCached<T>(
  key: string,
  getter: () => T | Promise<T>,
  ttlSeconds: number
): Promise<T> {
  const client = getRedis();

  if (client) {
    try {
      const cached = await client.get(key);
      if (cached) {
        return JSON.parse(cached) as T;
      }
    } catch {
      // Cache miss or error, continue to getter
    }
  }

  // Execute getter
  const result = await getter();

  // Store in cache (fire and forget)
  if (client && result !== null && result !== undefined) {
    client.setex(key, ttlSeconds, JSON.stringify(result)).catch(() => {});
  }

  return result;
}

/**
 * Invalidate cache keys by pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
      logger.info(`Cache invalidated: ${keys.length} keys matching "${pattern}"`);
    }
  } catch (err) {
    logger.warn('Cache invalidation failed:', err);
  }
}
