import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributesController } from './attributes.controller';
import { Attributes, AttributesSchema } from './schema/attributes.schema';

@Module({
  providers: [AttributesService],
  controllers: [AttributesController],
  imports: [
    MongooseModule.forFeature([{ name: Attributes.name, schema: AttributesSchema }]),
  ],
  exports: [AttributesService]
})
export class AttributesModule { }
