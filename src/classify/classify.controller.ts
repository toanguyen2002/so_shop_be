import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClassifyService } from './classify.service';
import { Public } from 'src/users/guard/user.guard';
import { ClassifyDTO } from './dto/classify.dto';
import { Classify } from './schema/classify.schema';

@Controller('classify')
export class ClassifyController {
    constructor(private readonly classifyService: ClassifyService) { }


    @Public()
    @Post()
    async addClassify(@Body() classifyDTO: ClassifyDTO) {
        console.log(classifyDTO);
        return await this.classifyService.addClassify(classifyDTO)
    }
    @Public()
    @Post('update')
    async updateClassify(@Body() classifyDTO: ClassifyDTO) {
        return await this.classifyService.updateClassify(classifyDTO)
    }

    @Public()
    @Get("/:id")
    async find(@Param("id") id: string): Promise<Classify[]> {
        return await this.classifyService.findDecripByProductsId(id)
    }
}
