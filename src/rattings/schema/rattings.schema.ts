import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Products } from "src/products/schema/product.schema";
import { Users } from "src/users/schema/users.schema";

export type RattingsDocument = Rattings & Document
@Schema()
export class Rattings {
    @Prop()
    comment: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users" })
    buyer: Users
    @Prop()
    star: number
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Products' })
    product: Products
}
export const RattingsSchema = SchemaFactory.createForClass(Rattings)