import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Products } from "src/products/schema/product.schema";
export type MediasDocument = Medias & Document;
@Schema()
export class Medias {
    @Prop()
    typeofMedia: string
    @Prop()
    urlMedia: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Products' })
    product: Products
}

export const MediasSchema = SchemaFactory.createForClass(Medias);