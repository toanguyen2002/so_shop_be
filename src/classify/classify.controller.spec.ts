import { Test, TestingModule } from '@nestjs/testing';
import { ClassifyController } from './classify.controller';

describe('ClassifyController', () => {
  let controller: ClassifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassifyController],
    }).compile();

    controller = module.get<ClassifyController>(ClassifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
