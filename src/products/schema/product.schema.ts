import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Categories } from "src/categories/schema/categories.schema";
import * as mongoose from 'mongoose';

import { Users } from "src/users/schema/users.schema";


export type ProductsDocument = Products & Document;
@Schema()
export class Products {
    //samsung A10
    @Prop({ required: true })
    productName: String
    //dtdd
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' })
    cate: Categories

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    seller: Users

    //samsung 
    @Prop({ required: true })
    brand: string
    //20
    @Prop({ required: true })
    selled: number
    //now
    @Prop({ required: true })
    dateUp: Date

    @Prop()
    images: string[]
    //img1,img2,img3
    // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medias' }] })
    // media: Medias[]
    //mieu ta: ram:ramvalue,rom:romvlaue ,
    // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attributes' }] })
    // attributes: Attributes[]
    // vd: Gold:250k:25
    // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classify' }] })
    // classify: Classify[]
    //dt dep
    // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rattings' }] })
    // rattings: Rattings[]
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
