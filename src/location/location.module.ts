import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationConsumer } from './location.consumer';
import { Area } from '../area/area.entity';
import { Log } from '../log/log.entity';
import { RabbitMQModule } from '../common/rabbitmq.module';
import { CustomLoggerService } from '../common/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Area, Log]), RabbitMQModule],
  controllers: [LocationController],
  providers: [LocationConsumer, CustomLoggerService],
})
export class LocationModule {}
