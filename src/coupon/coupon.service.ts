import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupons, CouponsDocuments } from './schema/coupon.schema';
import { Model } from 'mongoose';

@Injectable()
export class CouponService {
    constructor(@InjectModel(Coupons.name) private readonly model: Model<CouponsDocuments>) { }
}
