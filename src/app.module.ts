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
import { ProductsModule } from './products/products.module';
import { ClassifyModule } from './classify/classify.module';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { RattingsModule } from './rattings/rattings.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { CouponModule } from './coupon/coupon.module';
import { WalletController } from './wallet/wallet.controller';
import { WalletModule } from './wallet/wallet.module';
import { MediaController } from './media/media.controller';
import { MediaModule } from './media/media.module';
import { AttributesController } from './attributes/attributes.controller';
import { AttributesModule } from './attributes/attributes.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    ClassifyModule,
    CartModule,
    RattingsModule,
    CategoriesModule,
    CouponModule,
    WalletModule,
    MediaModule,
    AttributesModule,
    // MONGO_URI=mongodb+srv://toanguyen240124:DMLQKyF1sqj3Paul@cluster0.nkonvfp.mongodb.net/?retryWrites=true&w=majority
    MongooseModule.forRoot('mongodb://localhost:27017/osdtb'),
    JwtModule.register({
      global: true,
      secret: "nguyenquangtoan",
      signOptions: { expiresIn: '3600s' },
    }),
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
  controllers: [
    AppController,
    ProductsController,
    CartController,
    CategoriesController,
    WalletController,
    MediaController,
    AttributesController,
  ],
  providers:
    [AppService,
      {
        provide: APP_GUARD,
        useClass: UserGuard,
      },
      // ProductsService,
      // CartService,
      // CategoriesService,
      // WalletService,
      // MediaService,
    ],
})
export class AppModule { }