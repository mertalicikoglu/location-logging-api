import { Controller, Get, BadRequestException, UseInterceptors } from '@nestjs/common';
import { CacheKey, CacheTTL, CacheInterceptor } from '@nestjs/cache-manager';
import { Throttle } from '@nestjs/throttler';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
import { CustomLoggerService } from '../common/logger.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('logs')
@Controller('logs')
// @UseInterceptors(CacheInterceptor)
export class LogController {
  constructor(
    @InjectRepository(Log) private logRepository: Repository<Log>,
    private readonly logger: CustomLoggerService,
  ) { }

  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) //10 requests per minute
  // @CacheKey('logs')
  // @CacheTTL(300) //5 minutes cache time
  @ApiOperation({ summary: 'Get all logs' })
  @ApiResponse({ status: 200, description: 'List of all logs' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getLogs() {
    try {
      this.logger.log('Fetching all logs');
      return await this.logRepository.find();
    } catch (error) {
      this.logger.error('Error fetching logs', error.message);
      throw new BadRequestException('Could not retrieve logs.');
    }
  }
}