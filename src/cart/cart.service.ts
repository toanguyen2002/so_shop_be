import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocuemnt } from './schema/cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private readonly model: Model<CartDocuemnt>) { }
}
