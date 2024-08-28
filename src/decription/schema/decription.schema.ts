import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Products } from "src/products/schema/product.schema";
export type DecriptionDocument = Decription & Document;
@Schema()
export class Decription {
    @Prop()
    key: string
    @Prop()
    value: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Products' })
    product: Products
}

export const DecriptionSchema = SchemaFactory.createForClass(Decription);