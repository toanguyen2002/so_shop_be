import { forwardRef, Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Trade, TradeDocument } from './schema/trade.schema';
import { InjectModel } from '@nestjs/mongoose';
import { TradeDTO } from './dto/trade.dto';
import { HistoryService } from 'src/history/history.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class TradeService {
    constructor(@InjectModel(Trade.name) private readonly model: Model<TradeDocument>,

    ) { }
    async addTrade(tradeDTO: TradeDTO): Promise<Trade> {
        return await new this.model(tradeDTO).save()
    }
    async getTradeBySellerId(tradeDTO: TradeDTO): Promise<Trade[]> {
        return await this.model.aggregate(([{
            $match: { sellby: new mongoose.Types.ObjectId(tradeDTO.sellby) }
        }]))
    }
    async getTradeByTradeId(tradeDTO: TradeDTO): Promise<any> {

        return await this.model.aggregate(([{
            $match: { tradeId: tradeDTO.tradeId.toString() }
        },
        {
            $lookup: {
                from: "hisories",
                localField: "tradeId",
                foreignField: "idTrade",
                as: "histories"
            }
        }]))
    }

    async getTradeByBuyerId(tradeDTO: TradeDTO): Promise<Trade> {
        return await this.model.aggregate(([{
            $match: { buyer: new mongoose.Types.ObjectId(tradeDTO.buyer) }
        }]))[0]
    }

    async cancelTrade(tradeid: string): Promise<Trade> {
        const trade = await this.model.aggregate(([{
            $match: { buyer: new mongoose.Types.ObjectId(tradeid) }
        }]))[0]
        console.log();
        return null
    }
}
