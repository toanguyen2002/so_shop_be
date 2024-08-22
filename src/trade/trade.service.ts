import { forwardRef, Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Trade, TradeDocument } from './schema/trade.schema';
import { InjectModel } from '@nestjs/mongoose';
import { TradeDTO } from './dto/trade.dto';
@Injectable()
export class TradeService {
    constructor(@InjectModel(Trade.name) private readonly model: Model<TradeDocument>,) { }
    async addTrade(tradeDTO: TradeDTO): Promise<Trade> {

        return await new this.model(tradeDTO).save()
    }
    async getTradeBySellerId(tradeDTO: TradeDTO): Promise<Trade[]> {
        return await this.model.aggregate(([{
            $match: { seller: new mongoose.Types.ObjectId(tradeDTO.seller) }
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
        return null
    }

    async handleTradeSaction(tradeDTO: TradeDTO): Promise<Trade> {
        console.log(tradeDTO);
        return null
    }
}
