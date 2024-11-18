import { Controller, Get, Post, Body, BadRequestException, UseInterceptors, } from '@nestjs/common';
// import { CacheKey, CacheTTL, CacheInterceptor } from '@nestjs/cache-manager';
import { Throttle } from '@nestjs/throttler';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './area.entity';
import { CustomLoggerService } from '../common/logger.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import * as sanitize from 'sanitize-html';

@ApiTags('areas')
@Controller('areas')
// @UseInterceptors(CacheInterceptor)
export class AreaController {
  constructor(
    @InjectRepository(Area) private areaRepository: Repository<Area>,
    private readonly logger: CustomLoggerService,
  ) { }

  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) //10 requests per minute
  // @CacheKey('areas')
  // @CacheTTL(300) //5 minutes cache time
  @ApiOperation({ summary: 'Get all areas' })
  @ApiResponse({ status: 200, description: 'List of all areas' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getAreas() {
    try {
      this.logger.log('Fetching all areas');
      return await this.areaRepository.find();
    } catch (error) {
      this.logger.error('Error fetching areas', error.message);
      throw new BadRequestException('Could not retrieve areas.');
    }
  }

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) //5 requests per minute
  @ApiOperation({ summary: 'Add a new area' })
  @ApiResponse({ status: 201, description: 'Area added successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: Area })
  async addArea(@Body() areaDto: { name: string; latitude: number; longitude: number; radius: number }) {
    try {
      // Data sanitization process to prevent XSS attacks
      areaDto.name = sanitize(areaDto.name);
      this.logger.log(`Adding new area: ${JSON.stringify(areaDto)}`);
      const area = this.areaRepository.create(areaDto);
      return await this.areaRepository.save(area);
    } catch (error) {
      this.logger.error('Error adding area', error.message);
      throw new BadRequestException('Could not add area.');
    }
  }
}