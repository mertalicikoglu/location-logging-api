import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Establish a connection to RabbitMQ and close it immediately to check if it is healthy
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
      await connection.close();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError('RabbitMQ check failed', error);
    }
  }
}
