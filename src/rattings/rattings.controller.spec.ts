import { Test, TestingModule } from '@nestjs/testing';
import { RattingsController } from './rattings.controller';

describe('RattingsController', () => {
  let controller: RattingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RattingsController],
    }).compile();

    controller = module.get<RattingsController>(RattingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
