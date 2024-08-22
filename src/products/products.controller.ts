import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/users/guard/user.guard';
import { ProductsDTO, SellProductsDTO } from './dto/products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }
    @Public()
    @Post("/add")
    async addProduct(@Body() productDTO: ProductsDTO) {
        return await this.productService.addProducts(productDTO)
    }

    @Public()
    @Get("/")
    async getAllroduct() {
        return await this.productService.getProducts()
    }

    @Public()
    @Get("/:id")
    async getAllroductById(@Param('id') id: string) {
        return await this.productService.getProductById(id)
    }

    //66c1b3c185effdfab8c1bdfc
    // @Public()
    // @Post('/sell')
    // async sellProducts(@Body() sellProductsDTO: SellProductsDTO) {
    //     return await this.productService.sellProduct(sellProductsDTO)
    // }
}



