import { Test, TestingModule } from '@nestjs/testing';
import { EmpireController } from './empire.controller';

describe('EmpireController', () => {
  let controller: EmpireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpireController],
    }).compile();

    controller = module.get<EmpireController>(EmpireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
