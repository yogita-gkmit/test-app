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
          // AWS ElastiCache Cluster configuration
          // We force TLS because the cluster has Encryption in Transit enabled.
          // rejectUnauthorized: false is used to avoid connection errors due to certificate validation in some VPC setups.
         return new Cluster([process.env.REDIS_HOST!], {
            redisOptions: {
              tls: {
                rejectUnauthorized: false, // required for encryption in transit
              },
            },
            dnsLookup: (address, callback) => callback(null, address),
          });
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
