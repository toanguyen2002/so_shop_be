import { Module } from '@nestjs/common';
import { ZaloService } from './zalo.service';

@Module({
  providers: [ZaloService],
  exports: [ZaloService]
})
export class ZaloModule { }
