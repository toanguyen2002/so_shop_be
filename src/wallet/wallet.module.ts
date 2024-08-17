import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './schema/wallet.schema';

@Module({
    controllers: [WalletController],
    providers: [WalletService],
    imports: [
        MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    ],
    exports: [WalletService]
})
export class WalletModule { }
