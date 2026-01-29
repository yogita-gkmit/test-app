import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisHelper {
  constructor() {}

  itemsRequest(id: string): string {
    return `items:${id}`;
  }
}
