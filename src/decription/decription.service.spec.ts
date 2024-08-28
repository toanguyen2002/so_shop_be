import { Test, TestingModule } from '@nestjs/testing';
import { DecriptionService } from './decription.service';

describe('DecriptionService', () => {
  let service: DecriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DecriptionService],
    }).compile();

    service = module.get<DecriptionService>(DecriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
