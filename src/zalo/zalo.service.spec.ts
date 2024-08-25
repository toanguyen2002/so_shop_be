import { Test, TestingModule } from '@nestjs/testing';
import { ZaloService } from './zalo.service';

describe('ZaloService', () => {
  let service: ZaloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZaloService],
    }).compile();

    service = module.get<ZaloService>(ZaloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
