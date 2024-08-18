import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Products } from "src/products/schema/product.schema";
import { Users } from "src/users/schema/user.schema";

export type RattingsDocument = Rattings & Document
@Schema()
export class Rattings {
    @Prop()
    comment: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users" })
    user: Users
    @Prop()
    star: number
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Products' })
    product: Products
}
export const RattingsSchema = SchemaFactory.createForClass(Rattings)