import { Module } from '@nestjs/common';
import { ClassifyController } from './classify.controller';
import { ClassifyService } from './classify.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Classify, ClassifySchema } from './schema/classify.schema';

@Module({
  controllers: [ClassifyController],
  providers: [ClassifyService],
  imports: [
    MongooseModule.forFeature([{ name: Classify.name, schema: ClassifySchema }]),
  ],
  exports: [ClassifyService]
})
export class ClassifyModule { }
