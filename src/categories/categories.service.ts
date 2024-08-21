import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categories, CategoriesDocument } from './schema/categories.schema';
import { Model } from 'mongoose';
import { CategoriesDTO } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Categories.name)
        private readonly model: Model<CategoriesDocument>
    ) { }

    async add(cateName: CategoriesDTO): Promise<Categories> {
        return await new this.model(cateName).save()
    }

    async getAll(): Promise<Categories[]> {
        return await this.model.find().exec()
    }
    async getAllCateWithProductExist() {
        return await this.model.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "cate",
                    as: "products"
                }
            },
            {

                $unwind: "$products"

            }, {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            {
                                categoriesName: '$categoriesName',
                            },
                            '$products'
                        ]
                    }
                }
            }, {
                $group: {
                    _id: {
                        categoriesName: "$categoriesName",

                    },
                    products: {
                        $push: {
                            productName: "$productName",
                            brand: "$brand",
                            selled: "$selled",
                            dateUp: "$dateUp"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    categoriesName: "$_id.categoriesName",
                    products: 1
                }
            }
        ]);
    }
    update() { }

}
