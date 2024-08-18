import { Body, Controller, Post } from '@nestjs/common';
import { MediaService } from './media.service';
import { Public } from 'src/users/guard/user.guard';
import { MediaDTO } from './dto/media.dto';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Public()
    @Post()
    async addMedia(@Body() mediaDTO: MediaDTO) {
        return await this.mediaService.addMedia(mediaDTO)
    }

}
