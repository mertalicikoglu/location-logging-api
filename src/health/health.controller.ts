import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { RabbitMQHealthIndicator } from './rabbitmq.health';


@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private rabbitMQ: RabbitMQHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.rabbitMQ.isHealthy('rabbitmq'),
    ]);
  }
}