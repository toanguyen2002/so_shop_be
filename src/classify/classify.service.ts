import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Classify, ClassifyDocument } from './schema/classify.schema';
import { Model } from 'mongoose';
import { ClassifyDTO } from './dto/classify.dto';

@Injectable()
export class ClassifyService {
    constructor(@InjectModel(Classify.name) private readonly model: Model<ClassifyDocument>) { }

    async addClassify(classifyđTO: ClassifyDTO) {
        return await new this.model(
            classifyđTO
        ).save()
    }
}
