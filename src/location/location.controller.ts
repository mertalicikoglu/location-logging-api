import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQProvider } from '../common/rabbitmq.provider';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LocationDto } from './location.dto';
import { CustomLoggerService } from '../common/logger.service';
import * as sanitize from 'sanitize-html';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(
    private readonly rabbitMQProvider: RabbitMQProvider,
    private readonly logger: CustomLoggerService,
  ) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Add a new location' })
  @ApiResponse({ status: 201, description: 'Location added to queue' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: LocationDto })
  async addLocation(@Body() locationDto: LocationDto) {
    try {
      // Data sanitization to prevent XSS attacks
      locationDto.latitude = parseFloat(sanitize(locationDto.latitude.toString()));
      locationDto.longitude = parseFloat(sanitize(locationDto.longitude.toString()));
      locationDto.userId = sanitize(locationDto.userId);

      await this.rabbitMQProvider.sendToQueue('location_queue', locationDto);
      this.logger.log(`Location added to queue: ${JSON.stringify(locationDto)}`);
      return { status: 'Location added to queue' };
    } catch (error) {
      this.logger.error('Error adding location to queue', error.message);
      throw new BadRequestException('Location could not be added to queue.');
    }
  }
}
