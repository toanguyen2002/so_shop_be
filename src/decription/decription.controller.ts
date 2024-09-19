import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DecriptionDTO, DecriptionUpdateDTO } from './dto/decriptions.dto';
import { DecriptionService } from './decription.service';
import { Public, Roles } from 'src/users/guard/user.guard';
import { Decription } from './schema/decription.schema';
import { Role } from 'src/users/enum/role.enum';

@Controller('decription')
export class DecriptionController {
    constructor(private readonly DecripService: DecriptionService) { }

    @Roles(Role.SELLER)
    @Post()
    async addDecrip(@Body() deDTO: DecriptionDTO): Promise<Decription> {
        return await this.DecripService.addDecrip(deDTO)
    }
    @Public()
    @Get("/:id")
    async find(@Param("id") id: string): Promise<Decription[]> {
        return await this.DecripService.findDecripByProductsId(id)
    }

    @Roles(Role.SELLER)
    @Post("/update")
    async update(@Body() decrip: DecriptionUpdateDTO): Promise<Decription> {
        return await this.DecripService.updateDecription(decrip)
    }
}
