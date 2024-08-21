import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocuemnt } from './schema/cart.schema';
import mongoose, { Model } from 'mongoose';
import { ClassifyService } from 'src/classify/classify.service';
import { ProductsService } from 'src/products/products.service';


@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private readonly model: Model<CartDocuemnt>,
        private readonly classifService: ClassifyService,
        private readonly productsService: ProductsService,

    ) { }
    async addCart(buyer: string, seller: string, item: any): Promise<Cart> {
        const cart = await this.model.aggregate([
            { $match: { buyer: new mongoose.Types.ObjectId(buyer) } }
        ])
        if (cart.length > 0) {
            for (let i = 0; i < cart[0].products.length; i++) {
                if (cart[0].products[i].seller == seller) {
                    let lengthItem = await cart[0]?.products[i]?.items?.length;
                    for (let j = 0; j < lengthItem; j++) {
                        if (cart[0].products[i].items[j].productId == item.productId && cart[0].products[i].items[j].classifyId == item.classifyId) {
                            cart[0].products[i].items[j].numberProduct += item.numberProduct
                            this.calcUpdate(item)
                            return await this.model.findByIdAndUpdate(cart[0]._id, cart[0])
                        }
                    }
                    cart[0].products[i].items.push(item)
                    this.calcUpdate(item)
                    return await this.model.findByIdAndUpdate(cart[0]._id, cart[0])
                }
            }
            const items = []
            items.push(item)
            cart[0].products.push({ seller: seller, items: items })
            this.calcUpdate(item)

            return await this.model.findByIdAndUpdate(cart[0]._id, cart[0])
        } else {
            const products = []
            const items = []
            items.push(item)
            products.push({ seller, items })
            return await new this.model({ buyer: buyer, products: products }).save()
        }
    }

    async getCartByBuyerId(id: string): Promise<Cart> {
        const rs = await this.model.aggregate([{ $match: { buyer: new mongoose.Types.ObjectId(id) } }])
        return rs[0];
    }
    async calcUpdate(item: any) {
        await this.classifService.calcClassify(item.classifyId, -item.numberProduct)
        await this.productsService.calcProduct(item.productId, item.numberProduct)
    }
}
