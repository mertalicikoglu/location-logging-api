import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaController } from './area.controller';
import { Area } from './area.entity';
import { CustomLoggerService } from '../common/logger.service';
import * as redisStore from 'cache-manager-ioredis';


@Module({
  imports: [TypeOrmModule.forFeature([Area]), CacheModule.register({
    store: redisStore,
    host: 'redis',
    port: 6379,
  })],
  controllers: [AreaController],
  providers: [CustomLoggerService],
  exports: [TypeOrmModule],
})
export class AreaModule { }