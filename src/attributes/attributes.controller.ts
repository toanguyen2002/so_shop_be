import { Body, Controller, Get, Post } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributeDTO } from './dto/attribute.dto';
import { Public } from 'src/users/guard/user.guard';

@Controller('attributes')
export class AttributesController {
    constructor(private readonly attributeService: AttributesService) { }

    @Public()
    @Post()
    async add(@Body() attributeDTO: AttributeDTO) {
        // console.log(attributeDTO);

        return await this.attributeService.addAttribute(attributeDTO)

    }
}
