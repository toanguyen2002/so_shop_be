import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Users } from "src/users/schema/user.schema";

export type CartDocuemnt = Cart & Document
@Schema()
export class Cart {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    buyer: Users
    @Prop({
        type: mongoose.Schema.Types.Mixed,
    })
    products: any[]
}


export const CartSchemas = SchemaFactory.createForClass(Cart)