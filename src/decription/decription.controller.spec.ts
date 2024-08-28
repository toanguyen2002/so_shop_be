import { Test, TestingModule } from '@nestjs/testing';
import { DecriptionController } from './decription.controller';

describe('DecriptionController', () => {
  let controller: DecriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecriptionController],
    }).compile();

    controller = module.get<DecriptionController>(DecriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
