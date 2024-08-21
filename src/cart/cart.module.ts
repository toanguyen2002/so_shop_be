import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchemas } from './schema/cart.schema';
import { CartController } from './cart.controller';
import { ClassifyModule } from 'src/classify/classify.module';
import { ProductsModule } from 'src/products/products.module';


@Module({
    providers: [CartService],
    controllers: [CartController],
    imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchemas }]),
        ClassifyModule,
        forwardRef(() => ProductsModule)

    ],
    exports: [CartService]
})
export class CartModule { }
