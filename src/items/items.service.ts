import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
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

  async getItems() {
    const cacheKey = 'items:all';

    const cached = await this.redisService.getKey(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const items = await this.itemsRepository.find();

    this.redisService.setKey(
      cacheKey,
      JSON.stringify(items),
      60,
    );

    return items;
  }

  async getItemById(id: string): Promise<Item> {
    const cacheKey = this.redisHelper.itemsRequest(id);

    try {
      const cached = await this.redisService.getKey(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err: any) {
      console.error('Redis getItemById failed:', err.message);
    }

    const item = await this.itemsRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    this.redisService
      .setKey(cacheKey, JSON.stringify(item), 60)
      .catch(err => console.error('Redis setItemById failed:', err.message));

    return item;
  }

  async createItem(data: Partial<Item>): Promise<Item> {
    try {
      const item = this.itemsRepository.create(data);
      const savedItem = await this.itemsRepository.save(item);

      this.redisService
        .deleteKey('items:all')
        .catch(err => console.error('Redis delete items failed:', err.message));

      return savedItem;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        throw new ConflictException('Item with this name already exists');
      }
      throw error;
    }
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

    // invalidate caches (non-blocking)
    this.redisService
      .deleteKey('items:all')
      .catch(err => console.error('Redis delete items failed:', err.message));

    this.redisService
      .deleteKey(this.redisHelper.itemsRequest(id))
      .catch(err => console.error('Redis delete item failed:', err.message));


    return updatedItem;
  }


  async deleteItem(id: string): Promise<{ message: string }> {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.itemsRepository.softDelete(id);

    // invalidate caches (non-blocking)
    this.redisService
      .deleteKey('items:all')
      .catch(err => console.error('Redis delete items failed:', err.message));

    this.redisService
      .deleteKey(this.redisHelper.itemsRequest(id))
      .catch(err => console.error('Redis delete item failed:', err.message));

    return { message: 'Item deleted successfully' };
  }
}
