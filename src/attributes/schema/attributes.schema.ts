import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Products } from 'src/products/schema/product.schema';
export type AttributesDocument = Attributes & Document;
@Schema()
export class Attributes {
    @Prop({ unique: true, required: true })
    key: string
    @Prop({
        type: mongoose.Schema.Types.Mixed,
    })
    value?: any
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Products' })
    product: Products
}

export const AttributesSchema = SchemaFactory.createForClass(Attributes);