import { Test, TestingModule } from '@nestjs/testing';
import { RattingsService } from './rattings.service';

describe('RattingsService', () => {
  let service: RattingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RattingsService],
    }).compile();

    service = module.get<RattingsService>(RattingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
