import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from '../src/log/log.controller';
import { Repository } from 'typeorm';
import { Log } from '../src/log/log.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomLoggerService } from '../src/common/logger.service'; 

describe('LogController', () => {
  let controller: LogController;
  let logRepository: Repository<Log>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogController],
      providers: [
        {
          provide: getRepositoryToken(Log),
          useClass: Repository,
        },
        CustomLoggerService,
      ],
    }).compile();

    controller = module.get<LogController>(LogController);
    logRepository = module.get<Repository<Log>>(getRepositoryToken(Log));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});