import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Categories } from "src/categories/schema/categories.schema";
import * as mongoose from 'mongoose';
import { Medias } from "src/media/schema/media.schema";
import { Attributes } from "src/attributes/schema/attributes.schema";
import { Classify } from "src/classify/schema/classify.schema";


export type ProductsDocument = Products & Document;
@Schema()
export class Products {
    //samsung A10
    @Prop({ required: true })
    productName: String
    //dtdd
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' })
    cate: Categories
    //img1,img2,img3
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medias' }] })
    media: Medias[]
    //mieu ta: ram:ramvalue,rom:romvlaue ,
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attributes' }] })
    attributes: Attributes[]
    // vd: Gold:250k:25
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classify' }] })
    classify: Classify[]
    //samsung 
    @Prop()
    brand: string
    //20
    @Prop()
    selled: number
    //now
    @Prop()
    dateUp: Date
}

export const ProductsSchema = SchemaFactory.createForClass(Products);