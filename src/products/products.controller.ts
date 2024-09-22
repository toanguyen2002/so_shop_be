import { Body, Controller, Get, Inject, Param, Post, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Public, Roles } from 'src/users/guard/user.guard';
import { ProductsDTO, ProductsUpdateDTO, SellProductsDTO } from './dto/products.dto';
import { ProductsService } from './products.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';
import { Role } from 'src/users/enum/role.enum';
import { ClientProxy } from '@nestjs/microservices';
import { Products } from './schema/product.schema';


@Controller('products')
export class ProductsController {
    constructor(
        private readonly productService: ProductsService,
        private readonly aws: AwsService,
    ) { }

    @Public()
    @Post("/add")
    async addProduct(@Body() productDTO: ProductsDTO) {
        // console.log(productDTO);

        return await this.productService.addProducts(productDTO)
    }

    // @Public()
    // @Get("/demo1")
    // async demo1() {
    //     return await this.productService.demo1()
    // }
    // @Public()
    // @Get("/demo2")
    // async demo2() {
    //     return await this.productService.demo2()
    // }


    @Public()
    @Get("/")
    async getAllroduct() {
        return await this.productService.getProducts()
    }

    @Public()
    @Get("/seller/:id/:page")
    async getAllroductBysellerId(@Param("id") seller: string, @Param("page") page: any): Promise<any> {
        // console.log(rs);
        const start = 20 * (page - 1)
        const end = start + 20
        return (await this.productService.getProductBySellerId(seller)).slice(start == 0 ? start : start + 1, end)
    }

    @Public()
    @Get("dynamicfind")
    async handleFind(@Req() req: any) {
        const querys = []
        for (let key in req.query) {
            querys.push({ key: key, value: req.query[key] })
        }
        return await this.productService.dynamicFind(querys)


    }
    @Public()
    @Get("/findByid/:id")
    async getAllroductById(@Param('id') id: string) {
        return await this.productService.getProductById(id)
    }

    @Public()
    @Get("/mainFage")
    async getAllroducfoMainfage() {
        return await this.productService.getProductsForMainPage()
    }


    @Public()
    @Get("/findpage/:page")
    async getAllroducfByPage(@Param('page') page: number) {
        return await this.productService.getProductsByPage(page)
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


    @Public()
    @Get("/brand/:name")
    async getProductsByBrand(@Param("name") name: string): Promise<Products[]> {
        return this.productService.findProductByBrand(name);
    }
    @Public()
    @Get("/cate/:name")
    async getProductsByCate(@Param("name") name: string): Promise<Products[]> {
        return this.productService.findProductByCate(name);
    }

    @Roles(Role.SELLER)
    @Post("/updateProducts")
    async updateProducts(@Body() ProductsDTO: ProductsUpdateDTO): Promise<Products> {
        return this.productService.updateProdct(ProductsDTO);
    }



}




