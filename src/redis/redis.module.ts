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
          return new Cluster(
            [{ host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT ?? 6379) }],
            { redisOptions: { tls: {} } },
          );
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
