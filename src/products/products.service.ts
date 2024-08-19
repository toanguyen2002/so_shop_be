import { Inject, Injectable } from '@nestjs/common';
import { Products, ProductsDocument } from './schema/product.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductsDTO, SellProductsDTO } from './dto/products.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ClassifyService } from 'src/classify/classify.service';
import { WalletService } from 'src/wallet/wallet.service';
import { WallerDTO } from 'src/wallet/dto/wallet.dto';
import { error } from 'console';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Products.name) private readonly model: Model<ProductsDocument>,
        private readonly classifyService: ClassifyService,
        private readonly walletService: WalletService,
    ) { }


    async addProducts(productsDto: ProductsDTO): Promise<Products> {
        try {
            return await new this.model({
                productName: productsDto.productName,
                cate: productsDto.cate,
                brand: productsDto.brand,
                selled: 0,
                dateUp: Date.now(),
            }).save()
        } catch (error) {
            throw new ExceptionsHandler
        }
    }

    async getProducts(): Promise<Products[]> {
        return await this.model.find().exec();
    }

    async sellProduct(sellProductsDTO: SellProductsDTO): Promise<any> {
        const classify = await this.classifyService.getOnelassifyById(sellProductsDTO.classifyId)
        const balance = await this.walletService.getBalance({ user: sellProductsDTO.userId, balance: 0 })
        const totalBalence = classify.price * sellProductsDTO.numberProduct
        if (classify.stock >= sellProductsDTO.numberProduct) {
            if (balance.balance > totalBalence) {
                const updateClassify = await this.classifyService.updateClassifyWhenUserByProducts(sellProductsDTO)
                const products = await this.model.aggregate([{ $match: { _id: new mongoose.Types.ObjectId(sellProductsDTO.productId) } }])
                if (updateClassify) {
                    products[0].selled = products[0].selled + sellProductsDTO.numberProduct
                    await this.walletService.dereBalance({ user: sellProductsDTO.userId, balance: totalBalence })
                    await this.model.findByIdAndUpdate(products[0]._id, products[0])
                    return {
                        type: true,
                        Code: "Thanh Toán Thành Công Sản Phẩm"
                    };
                } else {

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
    async getProductById(id: string): Promise<any> {
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
                            medias: '$medias'
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
                    medias: '$medias'
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
                attributes: 1
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
                    classifies: '$classifies'
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
                medias: 1
            }
        }
        ])
    }
}
