import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


export type AttributesDocument = Attributes & Document;
@Schema()
export class Attributes {
    @Prop({ unique: true, required: true })
    key: string
    @Prop({
        type: mongoose.Schema.Types.Mixed,
    })
    value?: any
}

export const AttributesSchema = SchemaFactory.createForClass(Attributes);