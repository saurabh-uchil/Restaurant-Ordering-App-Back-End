import { Test, TestingModule } from '@nestjs/testing';
import { DietaryAlternativesService } from './dietary-alternatives.service';

describe('DietaryAlternativesService', () => {
  let service: DietaryAlternativesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DietaryAlternativesService],
    }).compile();

    service = module.get<DietaryAlternativesService>(DietaryAlternativesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
