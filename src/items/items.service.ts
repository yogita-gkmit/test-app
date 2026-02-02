import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './items.entity';
import { RedisService } from '../redis/redis.service';
import { RedisHelper } from '../redis/redis.helper';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly redisService: RedisService,
    private readonly redisHelper: RedisHelper,
  ) {}

  async getItems(): Promise<Item[]> {
    const cacheKey = 'items:all';

    const cached = await this.redisService.getKey(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const items = await this.itemsRepository.find();

    await this.redisService.setKey(
      cacheKey,
      JSON.stringify(items),
      60,
    );

    console.log(">>>>>>>>>>Redis items stored : ",items);
    console.log(">>>>>>>>>>Set KEY",  await this.redisService.setKey(
      cacheKey,
      JSON.stringify(items),
      60,
    ));
    
    return items;
  }

  async getItemById(id: string): Promise<Item> {
    const cacheKey = this.redisHelper.itemsRequest(id);

    const cached = await this.redisService.getKey(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const item = await this.itemsRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.redisService.setKey(
      cacheKey,
      JSON.stringify(item),
      60,
    );

    return item;
  }

  async createItem(data: Partial<Item>): Promise<Item> {
    const item = this.itemsRepository.create(data);
    const savedItem = await this.itemsRepository.save(item);

    // invalidate list cache
    await this.redisService.deleteKey('items:all');

    return savedItem;
  }

    async updateItem(
    id: string,
    data: Partial<Item>,
    ): Promise<Item> {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if (!item) {
        throw new NotFoundException('Item not found');
    }

    if (data.name && data.name !== item.name) {
        const exists = await this.itemsRepository.findOne({
        where: { name: data.name },
        });

        if (exists) {
        throw new BadRequestException('Item name already exists');
        }
    }

    Object.assign(item, data);
    const updatedItem = await this.itemsRepository.save(item);

    // invalidate caches
    await this.redisService.deleteKey('items:all');
    await this.redisService.deleteKey(this.redisHelper.itemsRequest(id));

    return updatedItem;
    }


  async deleteItem(id: string): Promise<{ message: string }> {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.itemsRepository.softDelete(id);

    // invalidate caches
    await this.redisService.deleteKey('items:all'); // because if dont delete it all then also the deleted item will be cached
    await this.redisService.deleteKey(this.redisHelper.itemsRequest(id));

    return { message: 'Item deleted successfully' };
  }
}
