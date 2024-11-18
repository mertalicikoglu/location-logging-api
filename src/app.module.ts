import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { HealthModule } from './health/health.module';
import { LocationModule } from './location/location.module';
import { AreaModule } from './area/area.module';
import { LogModule } from './log/log.module';
import { LoggerMiddleware } from './common/logger.middleware';
import { HelmetMiddleware } from './common/helmet.middleware';
import { CustomLoggerService } from './common/logger.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
      limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
    }]),
    TerminusModule,
    CacheModule.register({
      store: redisStore,
      host: 'redis',
      port: 6379,
    }),
    HealthModule,
    LocationModule,
    AreaModule,
    LogModule,
  ],
  providers: [CustomLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, HelmetMiddleware).forRoutes('*');
  }
}