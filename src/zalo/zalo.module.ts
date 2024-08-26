import { forwardRef, Module } from '@nestjs/common';
import { ZaloService } from './zalo.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { TradeModule } from 'src/trade/trade.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  providers: [ZaloService],
  exports: [ZaloService],
  imports: [
    WalletModule,
    forwardRef(() => TradeModule),
    forwardRef(() => ProductsModule)
  ]
})
export class ZaloModule { }
