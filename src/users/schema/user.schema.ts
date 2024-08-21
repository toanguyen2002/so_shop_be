import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "../enum/role.enum";


export type UsersDocument = Users & Document;
@Schema()
export class Users {
    @Prop({ unique: true, required: true })
    userName: String
    @Prop({ required: true })
    password: string
    @Prop()
    name: String
    @Prop()
    avata: String
    @Prop()
    role: Role[]
    @Prop()
    address: String
    @Prop()
    sex: string

}

export const UsersSchema = SchemaFactory.createForClass(Users);