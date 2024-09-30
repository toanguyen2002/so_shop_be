import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Users } from "src/users/schema/user.schema";

export type TradeDocument = Trade & Document
@Schema()
export class Trade {
    @Prop({ unique: true, required: true })
    tradeId: string


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users" })
    buyer: Users
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users" })
    seller: Users

    @Prop()
    sellerAccept: boolean
    @Prop()
    tradeStatus: boolean
    @Prop()
    payment: boolean
    @Prop()
    isCancel: boolean
    @Prop()
    isTrade: boolean


    @Prop()
    tradeTitle: String
    @Prop()
    balence: number
    @Prop()
    address: string
    @Prop()
    paymentMethod: string


    @Prop()
    dateTrade: Date


    @Prop({
        type: mongoose.Schema.Types.Mixed
    })
    products: any

}

export const TradeSchema = SchemaFactory.createForClass(Trade)