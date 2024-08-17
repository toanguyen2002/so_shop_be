import { Module } from '@nestjs/common';
import { RattingsController } from './rattings.controller';
import { RattingsService } from './rattings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rattings, RattingsSchema } from './schema/rattings.schema';

@Module({
  controllers: [RattingsController],
  providers: [RattingsService],
  imports: [
    MongooseModule.forFeature([{ name: Rattings.name, schema: RattingsSchema }]),
  ],
  exports: [RattingsService]
})
export class RattingsModule { }
