import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './schema/product.schema';
import { ProductsController } from './products.controller';
import { ClassifyService } from 'src/classify/classify.service';
import { ClassifyModule } from 'src/classify/classify.module';

@Module({
    providers: [ProductsService],
    controllers: [ProductsController],
    imports: [
        MongooseModule.forFeature([{ name: Products.name, schema: ProductsSchema }]),
        ClassifyModule,
    ],
    exports: [ProductsService],
})
export class ProductsModule { }
