import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Products, ProductsDocument } from './schema/product.schema';
import mongoose, { Model, PipelineStage } from 'mongoose';
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
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
// import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Products.name) private readonly model: Model<ProductsDocument>,
        private readonly classifyService: ClassifyService,
        private readonly walletService: WalletService,
        @Inject(forwardRef(() => TradeService))
        private readonly TradeService: TradeService,
        private readonly historyService: HistoryService,
        // private readonly aws: AwsService
        // @Inject("service") private rabitmq: ClientProxy

    ) { }
    async addProducts(productsDto: ProductsDTO): Promise<Products> {

        try {
            return await new this.model({
                productName: productsDto.productName,
                cate: productsDto.cate,
                brand: productsDto.brand,
                selled: 0,
                dateUp: Date.now(),
                seller: productsDto.seller,
                images: productsDto.images
            }).save()
        } catch (error) {
            throw new ExceptionsHandler
        }
    }

    // async demo1() {//add demo
    //     this.rabitmq.emit("event", await this.model.find().exec())
    // }

    // async demo2() {
    //     return this.rabitmq // find all
    //         .send({ cmd: 'trips' }, {})
    //         .pipe(timeout(5000));
    // }

    async getProducts(): Promise<Products[]> {
        return (await this.model.find().exec()).slice(0, 20);
    }
    async getProductsForMainPage(): Promise<Products[]> {
        return (await this.model.find().exec()).slice(0, 20);
    }
    async getProductsByPage(page: number): Promise<Products[]> {
        const start = (12 + 1) * (page - 1)
        const end = start + 20
        return (await this.model.find().exec()).slice(start == 0 ? start : start + 1, end)
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
    async dynamicFind(dynamicValue: any): Promise<Products[]> {
        const pipeline: any[] = [{
            $lookup: {
                from: "classifies",
                localField: "_id",
                foreignField: "product",
                as: "class"
            }
        }, {
            $unwind: "$class"
        }, {
            $group: {
                _id: "$_id",
                productName: { $first: "$productName" },
                cate: { $first: "$cate" },
                seller: { $first: "$seller" },
                brand: { $first: "$brand" },
                selled: { $first: "$selled" },
                dateUp: { $first: "$dateUp" },
                resp: { $first: "$class" }
            }
        }]
        if (dynamicValue[0]?.key == "brand" && dynamicValue[0].value != "") {
            pipeline.push({ $match: { brand: dynamicValue[0].value } })
        } else {
            pipeline.push({ $match: {} })
        }
        switch (dynamicValue[1]?.key) {
            case "selled":
                pipeline.push({ $sort: { selled: Number.parseFloat(dynamicValue[1]?.value) } })
                break;
            case "dateUp":
                pipeline.push({ $sort: { selled: Number.parseFloat(dynamicValue[1]?.value) } })
                break
            case "price":
                pipeline.push({ $sort: { "resp.price": Number.parseFloat(dynamicValue[1]?.value) } })
                break
        }
        return (await this.model.aggregate(pipeline).exec()).slice(0, 10);
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
                from: "decriptions",
                localField: "_id",
                foreignField: "product",
                as: "decriptions"
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
                            decriptions: '$decriptions',
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
                    decriptions: '$decriptions',
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
                decriptions: '$_id.decriptions',
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
                            decriptions: '$decriptions',
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
                    decriptions: '$decriptions',
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
                decriptions: '$_id.decriptions',
                seller: "$_id.seller",
                classifies: 1
            }
        },
        {
            $unwind: "$decriptions"
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
                        '$decriptions'
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
                decriptions: {
                    $push: {
                        key: "$key",
                        value: "$value",
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
                decriptions: 1
            }
        }
        ])
    }
    async getProductBySellerId(id: string): Promise<any> {
        return await this.model.aggregate([{
            $match:
            {
                seller: new mongoose.Types.ObjectId(id)
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
                from: "decriptions",
                localField: "_id",
                foreignField: "product",
                as: "decriptions"
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
                            decriptions: '$decriptions',
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
                    decriptions: '$decriptions',
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
                decriptions: '$_id.decriptions',
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
                            decriptions: '$decriptions',
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
                    decriptions: '$decriptions',
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
                decriptions: '$_id.decriptions',
                seller: "$_id.seller",
                classifies: 1
            }
        },
        {
            $unwind: "$decriptions"
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
                        '$decriptions'
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
                decriptions: {
                    $push: {
                        key: "$key",
                        value: "$value",
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
                decriptions: 1
            }
        }
        ])
    }

}
