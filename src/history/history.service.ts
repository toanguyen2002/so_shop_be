import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Hisories, HisoriesDocument } from './schema/history.schema';
import { HistoriesDTO } from './dto/histories.dto';

@Injectable()
export class HistoryService {
    constructor(@InjectModel(Hisories.name) private readonly model: Model<HisoriesDocument>) { }

    async createHistories(historiesDTO: HistoriesDTO): Promise<Hisories> {
        return await new this.model({ ...historiesDTO, dateTrade: new Date() }).save()
    }

    async getHistoriesByTradeId(id: string): Promise<any> {
        const rs = await this.model.aggregate([{ $match: { idTrade: id } }])
        return rs[0]
    }
}
