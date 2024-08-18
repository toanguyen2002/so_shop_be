import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public, Roles } from 'src/users/guard/user.guard';
import { CategoriesDTO } from './dto/categories.dto';
import { Role } from 'src/users/enum/role.enum';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly cateService: CategoriesService) { }

    // @Public()
    @Roles(Role.ADMIN)
    @Post("/add")
    async addCate(@Body() cateDTO: CategoriesDTO) {
        return await this.cateService.add(cateDTO.categoriesName);
    }
    @Public()
    @Get("/")
    async getCate() {
        return await this.cateService.getAll();
    }

}
