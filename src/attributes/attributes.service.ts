import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attributes, AttributesDocument } from './schema/attributes.schema';
import { Model } from 'mongoose';

@Injectable()
export class AttributesService {
    constructor(@InjectModel(Attributes.name) private readonly model: Model<AttributesDocument>) { }
}
