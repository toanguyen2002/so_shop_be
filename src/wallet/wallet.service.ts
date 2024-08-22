import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, WalletDocument } from './schema/wallet.schema';
import mongoose, { Model } from 'mongoose';
import { WallerDTO } from './dto/wallet.dto';

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(Wallet.name) private readonly model: Model<WalletDocument>,
    ) { }

    async createBalance(walletDTO: WallerDTO): Promise<Wallet> {
        return await new this.model({
            balance: 0,
            user: walletDTO.user
        }).save()
    }

    async getBalance(walletDTO: WallerDTO): Promise<Wallet> {
        const rs = await this.model.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(walletDTO.user) } }
        ])
        if (rs.length > 0) {
            return rs[0]
        } else {
            return await new this.model({
                balance: 0,
                user: walletDTO.user
            }).save()
        }
    }

    async increBalance(walletDTO: WallerDTO): Promise<Wallet> {
        const rs = await this.model.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(walletDTO.user) } }
        ])
        if (rs.length > 0) {
            rs[0].balance += walletDTO.balance
            await this.model.findByIdAndUpdate(rs[0]._id, rs[0])
        }
        return rs[0]
    }


    async dereBalance(walletDTO: WallerDTO): Promise<any> {
        const rs = await this.model.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(walletDTO.user) } }
        ])
        console.log(rs);

        if (rs.length > 0) {
            if (walletDTO.balance <= rs[0].balance) {
                rs[0].balance -= walletDTO.balance
                return await this.model.findByIdAndUpdate(rs[0]._id, rs[0])
            } else {
                return false
            }
        } else {
            return false
        }
    }


}
