import { Module } from '@nestjs/common';
import { RattingsController } from './rattings.controller';
import { RattingsService } from './rattings.service';

@Module({
  controllers: [RattingsController],
  providers: [RattingsService]
})
export class RattingsModule {}
