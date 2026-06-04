import { Test, TestingModule } from '@nestjs/testing';
import { DietaryAlternativesController } from './dietary-alternatives.controller';

describe('DietaryAlternativesController', () => {
  let controller: DietaryAlternativesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DietaryAlternativesController],
    }).compile();

    controller = module.get<DietaryAlternativesController>(DietaryAlternativesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
