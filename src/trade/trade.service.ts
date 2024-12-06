import { forwardRef, Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Trade, TradeDocument } from './schema/trade.schema';
import { InjectModel } from '@nestjs/mongoose';
import { TradeDTO } from './dto/trade.dto';
@Injectable()
export class TradeService {
  constructor(
    @InjectModel(Trade.name) private readonly model: Model<TradeDocument>,
  ) {}
  async addTrade(tradeDTO: TradeDTO): Promise<Trade> {
    return await new this.model(tradeDTO).save();
  }
  async getTradeBySellerId(id: string): Promise<Trade[]> {
    return await this.model.aggregate([
      {
        $match: { seller: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyers',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'sellers',
        },
      },
      {
        $unwind: '$buyers',
      },
      {
        $unwind: '$sellers',
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                _id: '$_id',
                brand: '$brand',
                sellerAccept: '$sellerAccept',
                tradeTitle: '$tradeTitle',
                tradeStatus: '$tradeStatus',
                payment: '$payment',
                balance: '$balance',
                products: '$products',
                dateTrade: '$dateTrade',
                balence: '$balence',
                tradeId: '$tradeId',
                paymentMethod: '$paymentMethod',
                isCancel: '$isCancel',
              },
              {
                buyersname: '$buyers.name',
                buyersaddress: '$buyers.address',
                buyersavata: '$buyers.avata',
                buyersuserName: '$buyers.userName',
                buyerId: '$buyers._id',
              },
              {
                sellersname: '$sellers.name',
                sellersaddress: '$sellers.address',
                sellersavata: '$sellers.avata',
                sellersuserName: '$sellers.userName',
                sellerId: '$sellers._id',
              },
            ],
          },
        },
      },
    ]);
  }

  async getTradeByTradeId(tradeDTO: TradeDTO): Promise<any> {
    return await this.model.aggregate([
      {
        $match: { tradeId: tradeDTO.tradeId.toString() },
      },
      {
        $lookup: {
          from: 'hisories',
          localField: 'tradeId',
          foreignField: 'idTrade',
          as: 'histories',
        },
      },
    ]);
  }

  async getTradeByStringTradeId(tradeId: string): Promise<any> {
    return await this.model.aggregate([
      {
        $match: { tradeId: tradeId },
      },
    ]);
  }

  async getTradeByBuyerId(id: string): Promise<Trade[]> {
    return await this.model.aggregate([
      {
        $match: { buyer: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyers',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'sellers',
        },
      },
      {
        $unwind: '$buyers',
      },
      {
        $unwind: '$sellers',
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                _id: '$_id',
                brand: '$brand',
                sellerAccept: '$sellerAccept',
                tradeTitle: '$tradeTitle',
                tradeStatus: '$tradeStatus',
                payment: '$payment',
                balance: '$balance',
                products: '$products',
                dateTrade: '$dateTrade',
                balence: '$balence',
                tradeId: '$tradeId',
                paymentMethod: '$paymentMethod',
                isCancel: '$isCancel',
              },
              {
                buyersname: '$buyers.name',
                buyersaddress: '$buyers.address',
                buyersavata: '$buyers.avata',
                buyersuserName: '$buyers.userName',
              },
              {
                sellersname: '$sellers.name',
                sellersaddress: '$sellers.address',
                sellersavata: '$sellers.avata',
                sellersuserName: '$sellers.userName',
                sellerId: '$sellers._id',
              },
            ],
          },
        },
      },
    ]);
  }

  async cancelTrade(tradeDTO: TradeDTO): Promise<Trade> {
    const trade = await this.model.aggregate([
      {
        $match: {
          buyer: new mongoose.Types.ObjectId(tradeDTO.buyer),
          tradeId: tradeDTO.tradeId,
        },
      },
    ]);

    trade[0].isCancel = true;
    return await this.model.findByIdAndUpdate(trade[0]._id, trade[0]);
  }

  async getTradeById(tradeDTO: TradeDTO): Promise<Trade> {
    const rs = await this.model.aggregate([
      { $match: { tradeId: tradeDTO.tradeId } },
    ]);
    if (rs.length == 0) {
      return;
    }
    return rs[0];
  }

  async getTradeByStringId(id: string): Promise<Trade> {
    const rs = await this.model.aggregate([{ $match: { tradeId: id } }]);
    if (rs.length == 0) {
      return;
    }
    return rs[0];
  }

  //người bán đồng ý mua hàng
  async acceptTrade(tradeDTO: TradeDTO): Promise<any> {
    const rs = await this.model.aggregate([
      { $match: { tradeId: tradeDTO.tradeId } },
    ]);
    rs[0].sellerAccept = true;
    return await this.model.findByIdAndUpdate(rs[0]._id, rs[0], { new: true });
  }

  //trang thai giao dich
  async updateStatusTrade(tradeDTO: TradeDTO): Promise<any> {
    const rs = await this.model.aggregate([
      { $match: { tradeId: tradeDTO.tradeId } },
    ]);
    rs[0].tradeStatus = true;
    return await this.model.findByIdAndUpdate(rs[0]._id, rs[0]);
  }
  async updateIsTrade(id: string): Promise<any> {
    const rs = await this.model.aggregate([
      { $match: { tradeId: id.toString() } },
    ]);
    // console.log(rs);
    rs[0].isTrade = true;
    return await this.model.findByIdAndUpdate(rs[0]._id, rs[0], { new: true });
  }

  async paymentTrade(tradeDTO: TradeDTO): Promise<any> {
    const rs = await this.model.aggregate([
      { $match: { tradeId: tradeDTO.tradeId } },
    ]);
    if (rs[0].payment) {
      return false;
    }
    rs[0].payment = true;
    return await this.model.findByIdAndUpdate(rs[0]._id, rs[0]);
  }

  async successPayment(tradeId: string): Promise<any> {
    const rs = await this.model.aggregate([{ $match: { tradeId: tradeId } }]);
    rs[0].payment = true;
    return await this.model.findByIdAndUpdate(rs[0]._id, rs[0]);
  }

  async gettradeInYear(userId: string): Promise<any> {
    return this.model.aggregate([
      {
        $match: {
          isCancel: false,
        },
      },
      {
        $project: {
          year: { $year: '$dateTrade' },
          month: { $month: '$dateTrade' },
          seller: 1,
          buyer: 1,
          balence: 1,
        },
      },
      {
        $group: {
          _id: {
            year: '$year',
            month: '$month',
            seller: '$seller',
            // buyer: '$buyer',
          },
          totalBalance: { $sum: '$balence' },
        },
      },
      {
        $project: {
          totalBalance: 1,
          year: '$_id.year',
          month: '$_id.month',
          seller: '$_id.seller',
          buyer: '$_id.buyer',
          _id: 0,
        },
      },
      {
        $match: {
          seller: new mongoose.Types.ObjectId(userId),
        },
      },
    ]);
  }

  async gettradeDayInMonth(
    userId: string,
    month: number,
    year: number,
  ): Promise<any> {
    return this.model.aggregate([
      {
        $project: {
          day: { $dayOfMonth: '$dateTrade' },
          month: { $month: '$dateTrade' },
          year: { $year: '$dateTrade' },
          seller: 1,
          products: 1,
          isCancel: 1,
          balence: 1,
          classifyId: { $arrayElemAt: ['$products.classifyId', 0] },
        },
      },
      {
        $match: {
          month: month,
          year: year,
          isCancel: false,
        },
      },
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: {
            day: '$day',
            seller: '$seller',
            classifyId: '$products.classifyId',
          },
          totalProducts: { $sum: '$products.numberProduct' },
          totalBalance: { $sum: '$balence' },
        },
      },
      {
        $group: {
          _id: { day: '$_id.day' },
          sellerDetails: {
            $push: {
              seller: '$_id.seller',
              classifyId: '$_id.classifyId',
              totalProducts: '$totalProducts',
              totalBalance: '$totalBalance',
            },
          },
        },
      },
      {
        $project: {
          day: '$_id.day',
          sellerDetails: 1,
          _id: 0,
        },
      },
      {
        $unwind: '$sellerDetails',
      },
      {
        $match: {
          'sellerDetails.seller': new mongoose.Types.ObjectId(userId),
        },
      },
    ]);
  }
}
