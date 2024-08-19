import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attributes, AttributesDocument } from './schema/attributes.schema';
import { Model } from 'mongoose';
import { AttributeDTO } from './dto/attribute.dto';

@Injectable()
export class AttributesService {
    constructor(@InjectModel(Attributes.name) private readonly model: Model<AttributesDocument>) { }


    async addAttribute(attributeDTO: AttributeDTO): Promise<Attributes> {
        return await new this.model({
            product: attributeDTO.productId,
            key: attributeDTO.key,
            value: attributeDTO.value
        }).save()
    }


}
