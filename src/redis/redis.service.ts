import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis, { Cluster } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis | Cluster,
  ) {}


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
