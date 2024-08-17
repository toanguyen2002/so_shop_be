import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaController } from './media.controller';
import { Medias, MediasSchema } from './schema/media.schema';

@Module({
    providers: [MediaService],
    controllers: [MediaController],
    imports: [
        MongooseModule.forFeature([{ name: Medias.name, schema: MediasSchema }]),
    ],
    exports: [MediaService]
})
export class MediaModule { }
