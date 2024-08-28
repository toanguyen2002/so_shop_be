import { Module } from '@nestjs/common';
import { DecriptionService } from './decription.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Decription, DecriptionSchema } from './schema/decription.schema';

@Module({
  providers: [DecriptionService],
  imports: [
    MongooseModule.forFeature([{ name: Decription.name, schema: DecriptionSchema }]),
  ],
  exports: [DecriptionService]
})
export class DecriptionModule { }
