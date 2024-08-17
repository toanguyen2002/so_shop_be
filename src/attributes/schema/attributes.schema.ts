import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type AttributesDocument = Attributes & Document;
@Schema()
export class Attributes {
    @Prop({ required: true })
    key: String
    @Prop()
    value: any
}

export const AttributesSchema = SchemaFactory.createForClass(Attributes);