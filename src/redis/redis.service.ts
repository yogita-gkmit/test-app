import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis, { Cluster } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: Redis | Cluster;

  onModuleInit() {
    const isAws = process.env.IS_AWS === 'true';
    console.log('[RedisService] IS_AWS:', isAws);

    if (isAws) {
      this.redisClient = new Cluster([
        { host: 'test-backend-redis-0001-001.test-backend-redis.wn13ev.aps1.cache.amazonaws.com', port: 6379 },
        { host: 'test-backend-redis-0001-002.test-backend-redis.wn13ev.aps1.cache.amazonaws.com', port: 6379 },
      ]);
      this.redisClient.on('error', (err) => console.error('[Redis Cluster Error]', err));
    } else {
      this.redisClient = new Redis({
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      });
      this.redisClient.on('error', (err) => console.error('[Redis Local Error]', err));
    }
  }

  async setKey(key: string, value: string, ttlInSeconds = 60): Promise<void> {
    await this.redisClient.set(key, value, 'EX', ttlInSeconds);
  }

  async getKey(key: string) {
    return this.redisClient.get(key);
  }

  async deleteKey(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

}
