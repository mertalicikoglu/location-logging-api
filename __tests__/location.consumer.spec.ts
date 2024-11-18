import { Test, TestingModule } from '@nestjs/testing';
import { LocationConsumer } from '../src/location/location.consumer';
import { Repository } from 'typeorm';
import { Area } from '../src/area/area.entity';
import { Log } from '../src/log/log.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomLoggerService } from '../src/common/logger.service';

describe('LocationConsumer', () => {
  let consumer: LocationConsumer;
  let areaRepository: Repository<Area>;
  let logRepository: Repository<Log>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationConsumer,
        {
          provide: getRepositoryToken(Area),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Log),
          useClass: Repository,
        },
        CustomLoggerService,
      ],
    }).compile();

    consumer = module.get<LocationConsumer>(LocationConsumer);
    areaRepository = module.get<Repository<Area>>(getRepositoryToken(Area));
    logRepository = module.get<Repository<Log>>(getRepositoryToken(Log));
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

});