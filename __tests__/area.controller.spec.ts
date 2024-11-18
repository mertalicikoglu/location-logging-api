import { Test, TestingModule } from '@nestjs/testing';
import { AreaController } from '../src/area/area.controller';
import { Repository } from 'typeorm';
import { Area } from '../src/area/area.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomLoggerService } from '../src/common/logger.service';

describe('AreaController', () => {
  let controller: AreaController;
  let areaRepository: Repository<Area>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaController],
      providers: [
        {
          provide: getRepositoryToken(Area),
          useClass: Repository,
        },
        CustomLoggerService,
      ],
    }).compile();

    controller = module.get<AreaController>(AreaController);
    areaRepository = module.get<Repository<Area>>(getRepositoryToken(Area));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more test cases as needed for new functionalities
});