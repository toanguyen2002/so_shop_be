import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocuemnt } from './schema/cart.schema';
import mongoose, { Model } from 'mongoose';
import { ClassifyService } from '../classify/classify.service';
import { ProductsService } from '../products/products.service';


@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private readonly model: Model<CartDocuemnt>,
        private readonly classifService: ClassifyService,
        private readonly productsService: ProductsService,

    ) { }
    async addCart(buyer: string, seller: string, item: any): Promise<any> {
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
                            if (await this.calcUpdate(item)) {
                                return {
                                    status: "thêm thành công",
                                    product: await this.model.findByIdAndUpdate(cart[0]._id, cart[0], { new: true })
                                }
                            } else {
                                return {
                                    status: "sản phẩm không đủ số lượng tồn kho",
                                    product: []
                                }
                            }
                        }
                    }
                    cart[0].products[i].items.push(item)
                    if (await this.calcUpdate(item)) {
                        return {
                            status: "thêm thành công",
                            product: await this.model.findByIdAndUpdate(cart[0]._id, cart[0], { new: true })
                        }
                    } else {
                        return {
                            status: "sản phẩm không đủ số lượng tồn kho",
                            product: []
                        }
                    }
                }
            }
            const items = []
            items.push(item)
            cart[0].products.push({ seller: seller, items: items })
            if (await this.calcUpdate(item)) {
                return {
                    status: "thêm thành công",
                    product: await this.model.findByIdAndUpdate(cart[0]._id, cart[0], { new: true })
                }
            } else {
                return {
                    status: "sản phẩm không đủ số lượng tồn kho",
                    product: []
                }
            }
        } else {
            const products = []
            const items = []
            if (this.calcUpdate(item)) {
                items.push(item)
                products.push({ seller, items })
                return await new this.model({ buyer: buyer, products: products }).save()
            } else {
                return "sản phẩm không đủ số lượng tồn kho"
            }

        }
    }

    async removeCart(buyer: string, seller: string, item: any): Promise<Cart> {
        const cart = await this.model.aggregate([
            { $match: { buyer: new mongoose.Types.ObjectId(buyer) } }
        ])
        if (cart.length > 0) {
            for (let i = 0; i < cart[0].products.length; i++) {
                if (cart[0].products[i].seller == seller) {
                    let lengthItem = await cart[0]?.products[i]?.items?.length;
                    for (let j = 0; j < lengthItem; j++) {
                        if (cart[0].products[i].items[j].productId == item.productId && cart[0].products[i].items[j].classifyId == item.classifyId) {
                            this.calcUpdate(item)
                            if (cart[0].products[i].items[j].numberProduct - item.numberProduct <= 0) {
                                cart[0].products[i].items.splice(j, 1)
                                return await this.model.findByIdAndUpdate(cart[0]._id, cart[0])
                            }
                            cart[0].products[i].items[j].numberProduct -= item.numberProduct
                            return await this.model.findByIdAndUpdate(cart[0]._id, cart[0])
                        }
                    }
                }
            }
        }

        return null
    }
    async removeItemsAfterTrade(buyer: string, seller: string, item: any): Promise<any> {
        const cart = await this.model.aggregate([
            { $match: { buyer: new mongoose.Types.ObjectId(buyer) } }
        ]);
        item.map((it: { productId: any; classifyId: any; }) => {
            let products = cart[0].products;
            for (let i = 0; i < products.length; i++) {
                if (products[i].seller === seller) {
                    products[i].items = products[i].items.filter((cartItem: any) => {
                        return !(cartItem.productId === it.productId && cartItem.classifyId === it.classifyId);
                    });
                    if (products[i].items.length === 0) {
                        products.splice(i, 1);
                    }
                }
            }

        })
        return await this.model.findByIdAndUpdate(cart[0]._id, cart[0], { new: true });
    }

    async getCartByBuyerId(id: string): Promise<Cart> {
        const rs = await this.model.aggregate([{ $match: { buyer: new mongoose.Types.ObjectId(id) } }])
        return rs[0];
    }
    async calcUpdate(item: any) {
        if (await this.classifService.calcClassify(item.classifyId, -item.numberProduct)) {
            await this.productsService.calcProduct(item.productId, item.numberProduct)
            return true
        } else {
            return false
        }


    }
}
