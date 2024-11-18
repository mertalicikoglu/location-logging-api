import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { LogController } from './log.controller';
import { Log } from './log.entity';
import { CustomLoggerService } from '../common/logger.service';
import * as redisStore from 'cache-manager-ioredis';


@Module({
  imports: [TypeOrmModule.forFeature([Log]),
  CacheModule.register({
    store: redisStore,
    host: 'redis',
    port: 6379,
  }),],
  controllers: [LogController],
  providers: [CustomLoggerService],
  exports: [TypeOrmModule],
})
export class LogModule { }