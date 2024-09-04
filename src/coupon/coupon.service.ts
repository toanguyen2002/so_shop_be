import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupons, CouponsDocuments } from './schema/coupon.schema';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'crypto';

@Injectable()
export class CouponService {
    constructor(@InjectModel(Coupons.name) private readonly model: Model<CouponsDocuments>) { }

    private readonly logger = new Logger(CouponService.name);


    @Cron(CronExpression.EVERY_SECOND)
    handleAutoCreateCoupons(){
        const dateStart = new Date(new Date().getDate()+2+ "/" + new Date().getMonth()+"/" + new Date().getFullYear())
        const code = randomUUID().slice(0,8)
        // console.log({code:code,nummOf:5,recent:10,buyers:[],seller:null});

        return new this.model({code:code,nummOf:5,recent:10,buyers:[],seller:null,dateStart:new Date(new Date().getDate()+ "/" + new Date().getMonth()+"/" + new Date().getFullYear()),dateEnd:new Date(new Date().getDate()+2 + "/" + new Date().getMonth()+"/" + new Date().getFullYear())}).save()
    }   
    
}
