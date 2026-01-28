import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from 'ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(config), TypeOrmModule.forFeature([])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}