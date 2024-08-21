import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Products, ProductsDocument } from './schema/product.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductsDTO, ProductsSearchStringDTO, SellProductsDTO } from './dto/products.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ClassifyService } from 'src/classify/classify.service';
import { WalletService } from 'src/wallet/wallet.service';
import { WallerDTO } from 'src/wallet/dto/wallet.dto';
import { error } from 'console';
import { TradeService } from 'src/trade/trade.service';
import * as bcrypt from 'bcrypt';
import { HistoryService } from 'src/history/history.service';
@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Products.name) private readonly model: Model<ProductsDocument>,
        private readonly classifyService: ClassifyService,
        private readonly walletService: WalletService,
        @Inject(forwardRef(() => TradeService))
        private readonly TradeService: TradeService,
        private readonly historyService: HistoryService
    ) { }


    async addProducts(productsDto: ProductsDTO): Promise<Products> {
        try {
            return await new this.model({
                productName: productsDto.productName,
                cate: productsDto.cate,
                brand: productsDto.brand,
                selled: 0,
                dateUp: Date.now(),
                seller: productsDto.seller
            }).save()
        } catch (error) {
            throw new ExceptionsHandler
        }
    }

    async getProducts(): Promise<Products[]> {
        return await this.model.find().exec();
    }
    async getProductsFlex(productsSearchStringDTO: ProductsSearchStringDTO): Promise<Products[]> {
        return this.model.find({
            productName: { $regex: productsSearchStringDTO.productName, $options: "i" },
            brand: { $regex: productsSearchStringDTO.brand, $options: "i" }
        })
    }
    async calcProduct(id: string, calcProduct: number): Promise<any> {
        const products = await this.model.aggregate([{ $match: { _id: new mongoose.Types.ObjectId(id) } }])
        products[0].selled = products[0].selled + calcProduct
        return await this.model.findByIdAndUpdate(id, products[0])
    }
    async sellProduct(sellProductsDTO: SellProductsDTO): Promise<any> {

        const classify = await this.classifyService.getOnelassifyById(sellProductsDTO.classifyId)
        const balance = await this.walletService.getBalance({ user: sellProductsDTO.buyer, balance: 0 })


        const totalBalence = classify.price * sellProductsDTO.numberProduct

        if (classify.stock >= sellProductsDTO.numberProduct) {
            if (balance.balance >= totalBalence) {
                const decreBalence = await this.walletService.dereBalance({ user: sellProductsDTO.buyer, balance: totalBalence })
                const updateClassify = await this.classifyService.updateClassifyWhenUserByProducts(sellProductsDTO)
                if (decreBalence) {
                    if (updateClassify) {
                        const products = await this.calcProduct(sellProductsDTO.productId, sellProductsDTO.numberProduct)
                        const trade = await this.TradeService.addTrade(
                            {
                                tradeStatus: "pendding",
                                buyer: sellProductsDTO.buyer.toString(),
                                seller: products.seller.toString(),
                                tradeId: (await bcrypt.hash(new Date().toString(), 10)).toString(),
                                tradeTitle: "Buy Products",
                                sellerAccept: false,
                                products: []
                            })
                        await this.historyService.createHistories({ idTrade: trade.tradeId, total: totalBalence, tradeItem: sellProductsDTO, buyHis: trade.buyer.toString() });

                        return {
                            type: true,
                            Code: "Thanh Toán Thành Công Sản Phẩm"
                        };
                    } else {
                        return {
                            type: false,
                            Code: "Thanh Toán Thất Bại Vì Sản Phẩm Không Đủ"
                        };
                    }
                } else {
                    return {
                        type: false,
                        Code: "Thanh Toán Thất Bại Vì Số Dư Không Đủ"
                    };
                }
            } else {
                return {
                    type: false,
                    Code: "Thanh Toán Thất Bại Vì Số Dư Không Đủ"
                };
            }
        } else {
            return {
                type: false,
                Code: "Sản Phẩm Không Đủ Hàng"
            };
        }

    }
    async sellAnyProducts() { }
    async getProductById(id: string): Promise<any> {
        // console.log(id);
        return await this.model.aggregate([{
            $match:
            {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "classifies",
                localField: "_id",
                foreignField: "product",
                as: "classifies"
            }
        },
        {
            $lookup: {
                from: "attributes",
                localField: "_id",
                foreignField: "product",
                as: "attributes"
            }
        }, {
            $lookup: {
                from: "medias",
                localField: "_id",
                foreignField: "product",
                as: "medias"
            }
        },
        {
            $unwind: "$attributes"
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        {
                            productName: '$productName',
                            brand: '$brand',
                            selled: '$selled',
                            dateUp: '$dateUp',
                            classifies: '$classifies',
                            medias: '$medias',
                            seller: "$seller"
                        },
                        '$attributes'
                    ]
                }
            }
        },
        {
            $group: {
                _id: {
                    productName: "$productName",
                    brand: '$brand',
                    selled: '$selled',
                    dateUp: '$dateUp',
                    classifies: '$classifies',
                    medias: '$medias',
                    seller: "$seller"

                },
                attributes: {
                    $push: {
                        key: "$key",
                        value: "$value"
                    }
                }
            }
        },
        {
            $project: {
                productName: "$_id.productName",
                brand: "$_id.brand",
                selled: "$_id.selled",
                dateUp: "$_id.dateUp",
                classifies: "$_id.classifies",
                medias: '$_id.medias',
                attributes: 1,
                seller: "$_id.seller"
            }
        },
        {
            $unwind: "$classifies"
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        {
                            productName: '$productName',
                            brand: '$brand',
                            selled: '$selled',
                            dateUp: '$dateUp',
                            attributes: '$attributes',
                            medias: '$medias',
                            seller: "$seller"
                        },
                        '$classifies'
                    ]
                }
            }
        },
        {
            $group: {
                _id: {
                    productName: "$productName",
                    brand: '$brand',
                    selled: '$selled',
                    dateUp: '$dateUp',
                    attributes: '$attributes',
                    medias: '$medias',
                    seller: "$seller"

                },
                classifies: {
                    $push: {
                        key: "$key",
                        value: "$value",
                        price: "$price",
                        stock: "$stock"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                productName: "$_id.productName",
                brand: "$_id.brand",
                selled: "$_id.selled",
                dateUp: "$_id.dateUp",
                attributes: "$_id.attributes",
                medias: '$_id.medias',
                seller: "$_id.seller",
                classifies: 1
            }
        },
        {
            $unwind: "$medias"
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        {
                            productName: '$productName',
                            brand: '$brand',
                            selled: '$selled',
                            dateUp: '$dateUp',
                            attributes: '$attributes',
                            classifies: '$classifies',
                            seller: "$seller"
                        },
                        '$medias'
                    ]
                }
            }
        },
        {
            $group: {
                _id: {
                    productName: "$productName",
                    brand: '$brand',
                    selled: '$selled',
                    dateUp: '$dateUp',
                    attributes: '$attributes',
                    classifies: '$classifies',
                    seller: "$seller"
                },
                medias: {
                    $push: {
                        urlMedia: "$urlMedia",
                        typeofMedia: "$typeofMedia",
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                productName: "$_id.productName",
                brand: "$_id.brand",
                selled: "$_id.selled",
                dateUp: "$_id.dateUp",
                attributes: "$_id.attributes",
                classifies: '$_id.classifies',
                seller: "$_id.seller",
                medias: 1
            }
        }
        ])
    }
}
