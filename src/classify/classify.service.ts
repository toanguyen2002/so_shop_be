import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Classify, ClassifyDocument } from './schema/classify.schema';
import mongoose, { Model } from 'mongoose';
import { ClassifyDTO, ClassifyUpdateDTO } from './dto/classify.dto';
import { SellProductsDTO } from 'src/products/dto/products.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ClassifyService {
    constructor(@InjectModel(Classify.name) private readonly model: Model<ClassifyDocument>,
    ) { }

    async addClassify(classifyđTO: ClassifyDTO): Promise<Classify> {
        return await new this.model(
            classifyđTO
        ).save()
    }


    async getAllClassifyByProductId(sellProductsDTO: SellProductsDTO): Promise<Classify> {
        const rs = await this.model.aggregate([{
            $match: {
                product: new mongoose.Types.ObjectId(sellProductsDTO.productId),
                _id: new mongoose.Types.ObjectId(sellProductsDTO.classifyId),
            }
        }])

        return rs[0]
    }


    async updateClassifyWhenUserByProducts(sellProductsDTO: SellProductsDTO): Promise<any> {
        try {
            const rs = await this.model.aggregate([{
                $match: {
                    product: new mongoose.Types.ObjectId(sellProductsDTO.productId),
                    _id: new mongoose.Types.ObjectId(sellProductsDTO.classifyId),
                }
            }])
            const calc = rs[0].stock - sellProductsDTO.numberProduct
            if (calc > 0) {
                rs[0].stock = calc
            }
            await this.model.findByIdAndUpdate(rs[0]._id, rs[0])
            return sellProductsDTO.numberProduct
        } catch (error) {
            return false;
        }
    }
}
