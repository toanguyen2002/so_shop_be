import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type ClassifyDocument = Classify & Document
@Schema()
export class Classify {
    @Prop()
    key: string
    @Prop()
    value: string
    @Prop()
    price: string
    @Prop()
    stock: number
}
export const ClassifySchema = SchemaFactory.createForClass(Classify);
