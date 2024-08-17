import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Users } from "src/users/schema/user.schema";

export type WalletDocument = Wallet & Document
@Schema()
export class Wallet {
    @Prop()
    balance: number
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users" })
    user: Users
}


export const WalletSchema = SchemaFactory.createForClass(Wallet)