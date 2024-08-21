import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './schema/product.schema';
import { ProductsController } from './products.controller';
import { ClassifyModule } from 'src/classify/classify.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { TradeModule } from 'src/trade/trade.module';
import { HistoryModule } from 'src/history/history.module';

@Module({
    providers: [ProductsService],
    controllers: [ProductsController],
    imports: [
        MongooseModule.forFeature([{ name: Products.name, schema: ProductsSchema }]),
        ClassifyModule,
        WalletModule,
        forwardRef(() => TradeModule),
        HistoryModule

    ],
    exports: [ProductsService],
})
export class ProductsModule { }
