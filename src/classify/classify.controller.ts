import { Body, Controller, Post } from '@nestjs/common';
import { ClassifyService } from './classify.service';
import { Public } from 'src/users/guard/user.guard';
import { ClassifyDTO } from './dto/classify.dto';

@Controller('classify')
export class ClassifyController {
    constructor(private readonly classifyService: ClassifyService) { }


    @Public()
    @Post()
    async addClassify(@Body() classifyDTO: ClassifyDTO) {
        console.log(classifyDTO);
        return await this.classifyService.addClassify(classifyDTO)
    }
}
