import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './users/guard/user.guard';
import { S3Module } from 'nestjs-s3';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { ClassifyModule } from './classify/classify.module';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { RattingsModule } from './rattings/rattings.module';
import { CategoriesService } from './categories/categories.service';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { CouponModule } from './coupon/coupon.module';

@Module({
  imports: [
    UsersModule,
    // MONGO_URI=mongodb+srv://toanguyen240124:DMLQKyF1sqj3Paul@cluster0.nkonvfp.mongodb.net/?retryWrites=true&w=majority
    MongooseModule.forRoot('mongodb://localhost:27017/osdtb'),
    JwtModule.register({
      global: true,
      secret: "nguyenquangtoan",
      signOptions: { expiresIn: '3600s' },
    }),
    ProductsModule,
    ClassifyModule,
    CartModule,
    RattingsModule,
    CategoriesModule,
    CouponModule,
    // S3Module.forRoot({
    //   config: {
    //     credentials: {
    //       accessKeyId: 'minio',
    //       secretAccessKey: 'password',
    //     },
    //     region: "",
    //     endpoint: '*',
    //     forcePathStyle: true,

    //   },
    // })
  ],
  controllers: [AppController, ProductsController, CartController, CategoriesController,],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: UserGuard,
  }, ProductsService, CartService, CategoriesService,],
})
export class AppModule { }
