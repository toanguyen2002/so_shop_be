import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ClassifyService } from './classify.service';
import { Public, Roles } from 'src/users/guard/user.guard';
import { ClassifyDTO, ClassifyUpdateAllAttDTO } from './dto/classify.dto';
import { Classify } from './schema/classify.schema';
import { Role } from 'src/users/enum/role.enum';

@Controller('classify')
export class ClassifyController {
    constructor(private readonly classifyService: ClassifyService) { }


    @Roles(Role.SELLER)
    @Post()
    async addClassify(@Body() classifyDTO: ClassifyDTO) {
        console.log(classifyDTO);
        return await this.classifyService.addClassify(classifyDTO)
    }
    // @Roles(Role.SELLER)
    @Public()
    @Post('update')
    async updateClassify(@Body() classifyDTO: ClassifyUpdateAllAttDTO) {
        return await this.classifyService.updateClassify(classifyDTO)
    }
    @Public()
    @Get("dynamicvalue")
    async findByIdreq(@Req() req: any): Promise<Classify[]> {
        return await this.classifyService.getclassifybyRequest(req)
    }
    @Public()
    @Get("/:id")
    async find(@Param("id") id: string): Promise<Classify[]> {
        return await this.classifyService.findDecripByProductsId(id)
    }




}
