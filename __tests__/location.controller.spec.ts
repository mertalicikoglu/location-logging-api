import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from '../src/location/location.controller';
import { AmqpConnection } from 'amqplib';
import { CustomLoggerService } from '../src/common/logger.service';

describe('LocationController', () => {
  let controller: LocationController;
  let amqpConnection: AmqpConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: AmqpConnection,
          useValue: {
            publish: jest.fn(),
          },
        },
        CustomLoggerService,
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more test cases as needed for new functionalities
});