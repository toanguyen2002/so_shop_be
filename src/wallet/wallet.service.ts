import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, WalletDocument } from './schema/wallet.schema';
import { Model } from 'mongoose';

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(Wallet.name) private readonly model: Model<WalletDocument>,
    ) { }
}
