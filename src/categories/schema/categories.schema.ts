import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CategoriesDocument = Categories & Document
@Schema()
export class Categories {
    @Prop()
    categoriesName: string
    @Prop()
    logo: string
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);

[
    {
        "_id": "66c1accca7a255b135c96ff4",
        "categoriesName": "Thực Phẩm",
        "__v": 0
    },
    {
        "_id": "66c1accfa7a255b135c96ff6",
        "categoriesName": "Dụng Cụ Học Tập",
        "__v": 0
    },
    {
        "_id": "66c1acd5a7a255b135c96ff8",
        "categoriesName": "Điện Da Dụng",
        "__v": 0
    }
]