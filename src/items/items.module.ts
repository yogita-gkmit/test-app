import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items.entity';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { RedisConfigModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    RedisConfigModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
