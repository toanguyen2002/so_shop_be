import { Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/users/guard/user.guard';
import { ProductsDTO, SellProductsDTO } from './dto/products.dto';
import { ProductsService } from './products.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from "aws-sdk"
import { AwsService } from 'src/aws/aws.service';


@Controller('products')
export class ProductsController {
    constructor(
        private readonly productService: ProductsService,
        private readonly aws: AwsService
    ) { }
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


    @Public()
    @Post("/files")
    @UseInterceptors(AnyFilesInterceptor())
    async updateSignFile(@UploadedFiles() files: Array<Express.Multer.File>) {
        const images = []
        await Promise.all(files.map(async (e) => {
            console.log(e);
            const data = await this.aws.updateSignFile(e);
            images.push(data)
        }))
        console.log(images);
        return images

    }

}



