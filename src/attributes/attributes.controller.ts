import { Body, Controller, Get, Post } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributeDTO, AttributeUpdateDTO } from './dto/attribute.dto';
import { Public, Roles } from 'src/users/guard/user.guard';
import { Role } from 'src/users/enum/role.enum';

@Controller('attributes')
export class AttributesController {
    constructor(private readonly attributeService: AttributesService) { }

    @Roles(Role.SELLER)
    @Post()
    async add(@Body() attributeDTO: AttributeDTO) {
        // console.log(attributeDTO);
        return await this.attributeService.addAttribute(attributeDTO)
    }
    @Roles(Role.SELLER)
    @Post("/update")
    async update(@Body() attributeDTO: AttributeUpdateDTO) {
        const rs = await this.attributeService.finđAnUpdate(attributeDTO)
        return rs
    }
}
