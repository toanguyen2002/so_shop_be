import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Medias, MediasDocument } from './schema/media.schema';
import { Model } from 'mongoose';
import { MediaDTO } from './dto/media.dto';

@Injectable()
export class MediaService {
    constructor(@InjectModel(Medias.name) private readonly model: Model<MediasDocument>) { }

    async addMedia(mediaDTO: MediaDTO) {
        return await new this.model(mediaDTO).save()
    }
}
