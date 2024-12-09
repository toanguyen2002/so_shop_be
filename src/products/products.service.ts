import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Products, ProductsDocument } from './schema/product.schema';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductsDTO,
  ProductsSearchStringDTO,
  ProductsUpdateDTO,
  SellProductsDTO,
} from './dto/products.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ClassifyService } from '../classify/classify.service';
import { WalletService } from '../wallet/wallet.service';
// import { WallerDTO } from '../wallet/dto/wallet.dto';
import { error } from 'console';
import { TradeService } from '../trade/trade.service';
// import * as bcrypt from 'bcrypt';
// import { HistoryService } from 'src/history/history.service';
// import { ClientProxy } from '@nestjs/microservices';
// import { timeout } from 'rxjs';
// import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name) private readonly model: Model<ProductsDocument>,
    private readonly classifyService: ClassifyService,
    private readonly walletService: WalletService,
    @Inject(forwardRef(() => TradeService))
    private readonly TradeService: TradeService,
    // private readonly historyService: HistoryService,
    // private readonly aws: AwsService
    // @Inject("service") private rabitmq: ClientProxy
  ) {}
  async addProducts(productsDto: ProductsDTO): Promise<Products> {
    try {
      return await new this.model({
        productName: productsDto.productName,
        cate: productsDto.cate,
        brand: productsDto.brand,
        selled: 0,
        dateUp: Date.now(),
        seller: productsDto.seller,
        images: productsDto.images,
      }).save();
    } catch (error) {
      throw new ExceptionsHandler();
    }
  }

  async getProducts(): Promise<Products[]> {
    return (await this.model.find().exec()).slice(0, 20);
  }
  async getNumProducts(): Promise<any> {
    return (await this.model.find().exec()).length;
  }
  async getProductsForMainPage(): Promise<Products[]> {
    return (await this.model.find().exec()).slice(0, 20);
  }
  async getProductsByPage(page: number): Promise<Products[]> {
    const start = 20 * (page - 1);
    const end = start + 20;
    return (await this.model.find().exec()).slice(
      start == 0 ? start : start + 1,
      end,
    );
  }
  async findProductsInNav(products: string): Promise<Products[]> {
    return await this.model.aggregate([
      {
        $match: {
          $or: [
            { productName: { $regex: products, $options: 'i' } },
            { brand: { $regex: products, $options: 'i' } },
          ],
        },
      },
      {
        $lookup: {
          from: 'classifies',
          localField: '_id',
          foreignField: 'product',
          as: 'class',
        },
      },
      {
        $group: {
          _id: '$_id',
          productName: { $first: '$productName' },
          images: { $first: '$images' },
          cate: { $first: '$cate' },
          seller: { $first: '$seller' },
          brand: { $first: '$brand' },
          selled: { $first: '$selled' },
          dateUp: { $first: '$dateUp' },
          classifies: { $first: '$class' },
        },
      },
    ]);
  }
  async calcProduct(id: string, calcProduct: number): Promise<any> {
    console.log('CALC calcProduct', { id, calcProduct });

    const products = await this.model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ]);
    products[0].selled = products[0].selled + calcProduct;
    await this.model.findByIdAndUpdate(id, products[0], { new: true });
    return true;
  }
  async dynamicFind(dynamicValue: any): Promise<any> {
    const pipeline: any = [
      {
        $lookup: {
          from: 'classifies',
          localField: '_id',
          foreignField: 'product',
          as: 'class',
        },
      },
      {
        $unwind: '$class',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'cate',
          foreignField: '_id',
          as: 'cate',
        },
      },
      {
        $unwind: '$cate',
      },
      {
        $group: {
          _id: '$_id',
          productName: { $first: '$productName' },
          images: { $first: '$images' },
          cateName: { $first: '$cate.categoriesName' },
          cate: { $first: '$cate._id' },
          seller: { $first: '$seller' },
          brand: { $first: '$brand' },
          selled: { $first: '$selled' },
          dateUp: { $first: '$dateUp' },
          resp: { $first: '$class' },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          images: 1,
          cateName: 1,
          seller: 1,
          brand: 1,
          selled: 1,
          dateUp: 1,
          resp: 1,
          cate: 1,
        },
      },
      {
        $lookup: {
          from: 'classifies',
          localField: '_id',
          foreignField: 'product',
          as: 'classifies',
        },
      },
    ];
    if (dynamicValue[1]?.key == 'brand' && dynamicValue[1].value != '') {
      pipeline.push({ $match: { brand: dynamicValue[1].value } });
    }
    if (dynamicValue[2]?.key == 'cate' && dynamicValue[2].value != '') {
      pipeline.push({
        $match: { cateName: { $regex: dynamicValue[2].value, $options: 'i' } },
      });
    } else {
      pipeline.push({ $match: {} });
    }
    switch (dynamicValue[3]?.key) {
      case 'selled':
        pipeline.push({
          $sort: { selled: Number.parseFloat(dynamicValue[3]?.value) },
        });
        break;
      case 'dateUp':
        pipeline.push({
          $sort: { selled: Number.parseFloat(dynamicValue[3]?.value) },
        });
        break;
      case 'price':
        pipeline.push({
          $sort: { 'resp.price': Number.parseFloat(dynamicValue[3]?.value) },
        });
        break;
    }
    const start = 20 * (dynamicValue[0]?.value - 1);
    const end = start + 20;
    console.log(start);
    console.log(end);

    return {
      data: (await this.model.aggregate(pipeline).exec()).slice(
        start == 0 ? start : start + 1,
        end,
      ),
      soLuongSP: (await this.model.aggregate(pipeline).exec()).length,
    };
  }
  async getNumProductsByIdSeller(id: string): Promise<any> {
    return (
      await this.model
        .aggregate([
          {
            $match: {
              seller: new mongoose.Types.ObjectId(id),
            },
          },
        ])
        .exec()
    ).length;
  }
  async getProductByIdForPayment(id: string): Promise<any> {
    return await this.model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
    ]);
  }
  async getProductById(id: string): Promise<any> {
    return await this.model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'classifies',
          localField: '_id',
          foreignField: 'product',
          as: 'classifies',
        },
      },
      {
        $lookup: {
          from: 'attributes',
          localField: '_id',
          foreignField: 'product',
          as: 'attributes',
        },
      },
      {
        $lookup: {
          from: 'decriptions',
          localField: '_id',
          foreignField: 'product',
          as: 'decriptions',
        },
      },
    ]);
  }
  async getProductBySellerId(id: string): Promise<any> {
    return await this.model.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'classifies',
          localField: '_id',
          foreignField: 'product',
          as: 'classifies',
        },
      },
      {
        $lookup: {
          from: 'attributes',
          localField: '_id',
          foreignField: 'product',
          as: 'attributes',
        },
      },
      {
        $lookup: {
          from: 'decriptions',
          localField: '_id',
          foreignField: 'product',
          as: 'decriptions',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'cate',
          foreignField: '_id',
          as: 'categories',
        },
      },
    ]);
  }
  async updateProdct(productDTO: ProductsUpdateDTO) {
    return this.model.findByIdAndUpdate(productDTO.id, productDTO);
  }

  async findProductByBrand(brand: string): Promise<Products[]> {
    return this.model.aggregate([{ $match: { brand: brand } }]);
  }

  async findProductByCate(cate: string): Promise<Products[]> {
    return this.model.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'cate',
          foreignField: '_id',
          as: 'cate',
        },
      },
      {
        $unwind: '$cate',
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
                seller: '$seller',
              },
              '$cate',
            ],
          },
        },
      },
      {
        $match: { categoriesName: cate },
      },
    ]);
  }
}
