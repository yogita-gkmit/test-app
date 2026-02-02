import { Global, Module } from '@nestjs/common';
import Redis, { Cluster } from 'ioredis';
import { RedisHelper } from './redis.helper';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const isAws = process.env.IS_AWS === 'true';
        if (isAws) {
          return new Cluster([
            { host: 'test-backend-redis-0001-001.test-backend-redis.wn13ev.aps1.cache.amazonaws.com', port: 6379 },
            { host: 'test-backend-redis-0001-002.test-backend-redis.wn13ev.aps1.cache.amazonaws.com', port: 6379 },
          ]);
        } else {
          return new Redis({
            host: process.env.REDIS_HOST ?? '127.0.0.1',
            port: Number(process.env.REDIS_PORT ?? 6379),
          });
        }
      },
    },
    RedisService,
    RedisHelper,
  ],
  exports: ['REDIS_CLIENT', RedisService, RedisHelper],
})
export class RedisConfigModule {}
