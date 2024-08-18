import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Products } from "src/products/schema/product.schema";
export type ClassifyDocument = Classify & Document
@Schema()
export class Classify {
    @Prop()
    key: string
    @Prop()
    value: string
    @Prop()
    price: number
    @Prop()
    stock: number
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Products' })
    product: Products
}
export const ClassifySchema = SchemaFactory.createForClass(Classify);
