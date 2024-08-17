import { Module } from '@nestjs/common';
import { ClassifyController } from './classify.controller';
import { ClassifyService } from './classify.service';

@Module({
  controllers: [ClassifyController],
  providers: [ClassifyService]
})
export class ClassifyModule {}
