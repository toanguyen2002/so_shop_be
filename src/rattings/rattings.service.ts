import { Injectable } from '@nestjs/common';
import { Rattings, RattingsDocument } from './schema/rattings.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RattingsService {
    constructor(
        @InjectModel(Rattings.name) private readonly model: Model<RattingsDocument>,
    ) { }
}
