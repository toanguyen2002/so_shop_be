import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categories, CategoriesDocument } from './schema/categories.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Categories.name) private readonly model: Model<CategoriesDocument>) { }
}
