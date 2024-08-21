import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Users } from "src/users/schema/user.schema";

export type HisoriesDocument = Hisories & Document;
@Schema()
export class Hisories {
    @Prop()
    idTrade: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users" })
    userHis: Users // id người mua nếu k là người mua => là người bán cho nút huỷ mua!
    @Prop()
    total: number
    @Prop()
    dateTrade: Date
    @Prop({
        type: mongoose.Schema.Types.Mixed,
    })
    tradeItem: any

}

export const HistoriesSchema = SchemaFactory.createForClass(Hisories)