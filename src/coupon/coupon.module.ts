import { forwardRef, Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupons, CouponsSchema } from './schema/coupon.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from 'src/users/users.module';
import { TradeModule } from 'src/trade/trade.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  controllers: [CouponController],
  providers: [CouponService],
  imports: [
    MongooseModule.forFeature([{ name: Coupons.name, schema: CouponsSchema }]),
    ScheduleModule.forRoot(),
    forwardRef(() => UsersModule),
    TradeModule,
    WalletModule,
  ],
  exports: [CouponService],
})
export class CouponModule {}
