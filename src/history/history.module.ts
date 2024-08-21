import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Hisories, HistoriesSchema } from './schema/history.schema';
import { HistoryController } from './history.controller';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [
    MongooseModule.forFeature([{ name: Hisories.name, schema: HistoriesSchema }]),
  ],
  exports: [HistoryService]
})
export class HistoryModule { }
