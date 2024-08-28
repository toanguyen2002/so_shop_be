import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DecriptionDTO } from './dto/decriptions.dto';
import { DecriptionService } from './decription.service';
import { Public } from 'src/users/guard/user.guard';
import { Decription } from './schema/decription.schema';

@Controller('decription')
export class DecriptionController {
    constructor(private readonly DecripService: DecriptionService) { }

    @Public()
    @Post()
    async addDecrip(@Body() deDTO: DecriptionDTO): Promise<Decription> {
        return await this.DecripService.addDecrip(deDTO)
    }

    @Public()
    @Get("/:id")
    async find(@Param("id") id: string): Promise<Decription[]> {
        return await this.DecripService.findDecripByProductsId(id)
    }
}
