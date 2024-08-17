import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchemas } from './schema/cart.schema';
import { CartController } from './cart.controller';

@Module({
    providers: [CartService],
    controllers: [CartController],
    imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchemas }]),
    ],
    exports: [CartService]
})
export class CartModule { }
