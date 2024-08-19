import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './schema/product.schema';
import { ProductsController } from './products.controller';
import { ClassifyService } from 'src/classify/classify.service';
import { ClassifyModule } from 'src/classify/classify.module';
import { UsersModule } from 'src/users/users.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
    providers: [ProductsService],
    controllers: [ProductsController],
    imports: [
        MongooseModule.forFeature([{ name: Products.name, schema: ProductsSchema }]),
        ClassifyModule,
        WalletModule,
    ],
    exports: [ProductsService],
})
export class ProductsModule { }
