import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributeDTO, AttributeUpdateDTO } from './dto/attribute.dto';
import { Public, Roles } from 'src/users/guard/user.guard';
import { Role } from 'src/users/enum/role.enum';
import { Attributes } from './schema/attributes.schema';

@Controller('attributes')
export class AttributesController {
    constructor(private readonly attributeService: AttributesService) { }

    @Roles(Role.SELLER)
    @Post()
    async add(@Body() attributeDTO: AttributeDTO): Promise<Attributes> {
        // console.log(attributeDTO);
        return await this.attributeService.addAttribute(attributeDTO)
    }
    @Roles(Role.SELLER)
    @Post("/update")
    async update(@Body() attributeDTO: AttributeUpdateDTO): Promise<Attributes> {
        const rs = await this.attributeService.finđAnUpdate(attributeDTO)
        return rs
    }

    @Roles(Role.SELLER)
    @Get("/delete/:id")
    async delete(@Param("id") id: string): Promise<Attributes> {
        return await this.attributeService.deleteAttribute(id)
    }
}
