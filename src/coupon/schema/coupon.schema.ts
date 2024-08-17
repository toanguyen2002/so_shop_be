import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Users } from "src/users/schema/user.schema";

export type CouponsDocuments = Coupons & Document
@Schema()
export class Coupons {
    @Prop()
    code: string
    @Prop()
    nummOf: number
    @Prop()
    recent: string
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }] })
    users: Users[]

}

export const CouponsSchema = SchemaFactory.createForClass(Coupons);