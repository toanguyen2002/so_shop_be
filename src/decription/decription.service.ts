import { Injectable } from '@nestjs/common';
import { Decription, DecriptionDocument } from './schema/decription.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DecriptionDTO } from './dto/Decription.dto';

@Injectable()
export class DecriptionService {
    constructor(@InjectModel(Decription.name) private readonly model: Model<DecriptionDocument>) { }

    async addDecrip(decripDTO: DecriptionDTO) {
        return await new this.model(decripDTO).save()
    }
    async findDecripByProductsId(id: string): Promise<Decription[]> {
        return await this.model.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(id) } }
        ])
    }
}
