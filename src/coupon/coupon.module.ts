import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupons, CouponsSchema } from './schema/coupon.schema';

@Module({
  controllers: [CouponController],
  providers: [CouponService],
  imports: [
    MongooseModule.forFeature([{ name: Coupons.name, schema: CouponsSchema }]),
  ],
  exports: [CouponService]
})
export class CouponModule { }
