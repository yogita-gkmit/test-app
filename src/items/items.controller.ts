import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './items.entity';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  getItems() {
    return this.itemsService.getItems();
  }

  @Get(':id')
  getItem(@Param('id') id: string) {
    return this.itemsService.getItemById(id);
  }

  @Post()
  createItem(@Body() body: Partial<Item>) {
    return this.itemsService.createItem(body);
  }

  @Patch(':id')
  updateItem(
    @Param('id') id: string,
    @Body() body: Partial<Item>,
  ) {
    return this.itemsService.updateItem(id, body);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return this.itemsService.deleteItem(id);
  }
}
