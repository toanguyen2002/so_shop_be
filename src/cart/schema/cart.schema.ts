import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Products } from "src/products/schema/product.schema";
import { Users } from "src/users/schema/user.schema";

export type CartDocuemnt = Cart & Document
@Schema()
export class Cart {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    user: Users
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }] })
    products: Products[]
}


export const CartSchemas = SchemaFactory.createForClass(Cart)