import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export type MediasDocument = Medias & Document;
@Schema()
export class Medias {
    @Prop()
    typeofMedia: string
    @Prop()
    urlMedia: string
}

export const MediasSchema = SchemaFactory.createForClass(Medias);