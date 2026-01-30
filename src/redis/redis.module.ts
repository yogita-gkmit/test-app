import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisHelper } from './redis.helper';
import { RedisService } from './redis.service';
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT ?? 6379),
          tls: {},
        });
      },
    },
    RedisService,
    RedisHelper,
  ],

  exports: ['REDIS_CLIENT', RedisService, RedisHelper],
})
export class RedisConfigModule {}
