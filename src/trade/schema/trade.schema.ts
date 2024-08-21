import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Users } from "src/users/schema/user.schema";

export type TradeDocument = Trade & Document
@Schema()
export class Trade {
    @Prop({ unique: true, required: true })
    tradeId: string
    @Prop()
    tradeStatus: string
    @Prop()
    tradeTitle: String
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users" })
    buyer: Users
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users" })
    sellby: Users
    @Prop()
    sellerAccept: boolean

}

export const TradeSchema = SchemaFactory.createForClass(Trade)