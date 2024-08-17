import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CategoriesDocument = Document & Categories
Schema()
export class Categories {
    @Prop()
    cateName: string
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);