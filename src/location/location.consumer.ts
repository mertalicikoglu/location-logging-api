import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQProvider } from '../common/rabbitmq.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from '../area/area.entity';
import { Log } from '../log/log.entity';
import { CustomLoggerService } from '../common/logger.service';

@Injectable()
export class LocationConsumer implements OnModuleInit {
  constructor(
    @InjectRepository(Area) private areaRepository: Repository<Area>,
    @InjectRepository(Log) private logRepository: Repository<Log>,
    private readonly logger: CustomLoggerService,
    private readonly rabbitMQProvider: RabbitMQProvider,
  ) { }

  async onModuleInit() {
    await this.rabbitMQProvider.consume('location_queue', async (msg) => {
      if (msg) {
        const location = JSON.parse(msg.content.toString());
        await this.processLocation(location);
      }
    });
  }
  // Process location data and check if user is in any area
  private async processLocation(location: { userId: string; latitude: number; longitude: number }) {
    try {
      const areas = await this.areaRepository.find();

      for (const area of areas) {
        const distance = this.calculateDistance(
          location.latitude,
          location.longitude,
          area.latitude,
          area.longitude,
        );

        if (distance <= area.radius) {
          const log = new Log();
          log.userId = location.userId;
          log.areaId = area.id;
          await this.logRepository.save(log);
          this.logger.log(`User ${location.userId} entered area ${area.id}`);
        }
      }
    } catch (error) {
      this.logger.error('Error processing location', error.message);
    }
  }
  // Haversine formula to calculate distance between two points
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
