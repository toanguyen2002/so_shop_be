import { forwardRef, Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './schema/trade.schema';
import { HistoryModule } from 'src/history/history.module';
import { UsersController } from 'src/users/users.controller';
import { WalletModule } from 'src/wallet/wallet.module';
import { ProductsModule } from 'src/products/products.module';
import { ClassifyModule } from 'src/classify/classify.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
    controllers: [TradeController],
    providers: [TradeService],
    imports: [
        MongooseModule.forFeature([{ name: Trade.name, schema: TradeSchema }]),
        WalletModule,
        HistoryModule,
        forwardRef(() => ProductsModule),
        ClassifyModule,
        CartModule


    ],
    exports: [TradeService]
})
export class TradeModule { }
