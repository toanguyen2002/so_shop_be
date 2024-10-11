import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Users } from "src/users/schema/users.schema";

export type CouponsDocuments = Coupons & Document
@Schema()
export class Coupons {
    @Prop()
    code: string
    @Prop()
    nummOf: number
    @Prop()
    recent: number
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }] })
    buyers: Users[]
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users" })
    seller: Users
    @Prop()
    dateStart: Date
    @Prop()
    dateEnd: Date

}

export const CouponsSchema = SchemaFactory.createForClass(Coupons);