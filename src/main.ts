import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLoggerService } from './common/logger.service';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // CORS Options
  // app.enableCors({
  //   origin: 'http://example.com', // Change this to your frontend URL
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Location Logging API')
    .setDescription('API documentation for the Location Logging Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();