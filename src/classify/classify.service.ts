import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Classify, ClassifyDocument } from './schema/classify.schema';
import mongoose, { Model, Mongoose } from 'mongoose';
import {
  ClassifyDTO,
  ClassifyUpdateAllAttDTO,
  ClassifyUpdateDTO,
} from './dto/classify.dto';
import { SellProductsDTO } from '../products/dto/products.dto';
// import { ProductsService } from '../products/products.service';

@Injectable()
export class ClassifyService {
  constructor(
    @InjectModel(Classify.name) private readonly model: Model<ClassifyDocument>,
  ) {}

  async addClassify(classifyđTO: ClassifyDTO): Promise<Classify> {
    return await new this.model(classifyđTO).save();
  }

  async updateClassify(
    classifyđTO: ClassifyUpdateAllAttDTO,
  ): Promise<Classify> {
    const classify = await this.model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(classifyđTO.id) } },
    ]);
    console.log(classifyđTO.stock);
    if (classifyđTO.stock) {
      classifyđTO.stock += classify[0].stock;
    }
    if (classifyđTO.stock <= 0) {
      classifyđTO.stock = classify[0].stock;
    }
    return await this.model.findByIdAndUpdate(classify[0]._id, classifyđTO, {
      new: true,
    });
  }
  async updateClassifyByIdClassify(
    id: string,
    calc: number,
  ): Promise<Classify> {
    const classify = await this.model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ]);
    classify[0].stock += calc;
    return await this.model.findByIdAndUpdate(id, classify[0]);
  }
  async getOnelassifyById(id: string): Promise<Classify> {
    return await this.model.findById(id);
  }
  async findDecripByProductsId(id: string): Promise<Classify[]> {
    return await this.model.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(id) } },
    ]);
  }
  async getAllClassifyByProductId(
    sellProductsDTO: SellProductsDTO,
  ): Promise<Classify> {
    const rs = await this.model.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(sellProductsDTO.productId),
          _id: new mongoose.Types.ObjectId(sellProductsDTO.classifyId),
        },
      },
    ]);

    return rs[0];
  }

  async updateClassifyWhenUserByProducts(
    sellProductsDTO: SellProductsDTO,
  ): Promise<any> {
    try {
      const rs = await this.model.aggregate([
        {
          $match: {
            product: new mongoose.Types.ObjectId(sellProductsDTO.productId),
            _id: new mongoose.Types.ObjectId(sellProductsDTO.classifyId),
          },
        },
      ]);
      const calc = rs[0].stock - sellProductsDTO.numberProduct;
      if (calc >= 0) {
        rs[0].stock = calc;
        await this.model.findByIdAndUpdate(rs[0]._id, rs[0]);
        return {
          sellNumber: sellProductsDTO.numberProduct,
          total: sellProductsDTO.numberProduct * rs[0].price,
        };
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  async calcClassify(id: string, calcClassify: number): Promise<any> {
    console.log('CALC calcClassify', { id, calcClassify });

    const classify = await this.model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id.toString()) } },
    ]);

    if (calcClassify < 0 && classify[0].stock + calcClassify < 0) {
      return false;
    }
    classify[0].stock = classify[0].stock + calcClassify;
    await this.model.findByIdAndUpdate(id, classify[0], { new: true });
    return true;
  }
  async getclassifybyRequest(value: any): Promise<any> {
    const querys = [];
    for (let key in value.query) {
      querys.push({ key: key, value: value.query[key] });
    }
    console.log(querys);

    const pipes = [];
    if (querys[2].value !== '') {
      // console.log(""==querys[2].value);
      pipes.push({
        $match: {
          key: querys[1].value,
          _id: new mongoose.Types.ObjectId(querys[0]?.value),
          value: querys[2]?.value,
        },
      });
    } else {
      // console.log(""==querys[2].value);
      pipes.push({ $match: { key: querys[1].value } });
    }
    // console.log(pipes);
    return await this.model.aggregate(pipes);
  }

  async getAllClass() {
    return await this.model.find();
  }

  async getProductsBYIDClass(id: string) {
    return await this.model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'p',
        },
      },
      {
        $unwind: '$p',
      },
    ]);
  }
}
