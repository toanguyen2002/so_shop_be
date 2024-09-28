import { forwardRef, Module } from '@nestjs/common';
import { ZaloService } from './zalo.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { TradeModule } from 'src/trade/trade.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [ZaloService],
  exports: [ZaloService],
  imports: [
    WalletModule,
    forwardRef(() => TradeModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => UsersModule),
  ]
})
export class ZaloModule { }
