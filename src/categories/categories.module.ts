import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Categories, CategoriesSchema } from './schema/categories.schema';

@Module({
    providers: [CategoriesService],
    controllers: [CategoriesController],
    imports: [
        MongooseModule.forFeature([{ name: Categories.name, schema: CategoriesSchema }]),
    ],
    exports: [CategoriesService]
})
export class CategoriesModule { }
