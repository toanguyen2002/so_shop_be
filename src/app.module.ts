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
import { AttributesController } from './attributes/attributes.controller';
import { AttributesModule } from './attributes/attributes.module';
import { HistoryController } from './history/history.controller';
import { HistoryModule } from './history/history.module';
import { TradeController } from './trade/trade.controller';
import { TradeModule } from './trade/trade.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './aws/aws.module';
import { ZaloModule } from './zalo/zalo.module';
import { DecriptionController } from './decription/decription.controller';
import { DecriptionModule } from './decription/decription.module';

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
    AttributesModule,
    // MONGO_URI=mongodb+srv://toanguyen240124:DMLQKyF1sqj3Paul@cluster0.nkonvfp.mongodb.net/?retryWrites=true&w=majority
    MongooseModule.forRoot('mongodb://localhost:27017/osdtb'),
    // MongooseModule.forRoot(process.env.MONGO_URI),

    JwtModule.register({
      global: true,
      secret: "nguyenquangtoan",
      signOptions: { expiresIn: '3600s' },
    }),
    HistoryModule,
    TradeModule,
    // S3Module.forRoot({
    //   config: {
    //     credentials: {
    //       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //     },
    //     region: "us-east-1",
    //     endpoint: '*',
    //     forcePathStyle: true,

    //   },
    // }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => (
        {
          transport: {
            host: 'smtp.gmail.com',
            secure: false,
            auth: {
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
            },
          }
        }
      )
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AwsModule,
    ZaloModule,
    DecriptionModule
  ],
  controllers: [
    AppController,
    ProductsController,
    CartController,
    CategoriesController,
    WalletController,
    AttributesController,
    HistoryController,
    TradeController,
    DecriptionController,
  ],
  providers:
    [AppService,
      {
        provide: APP_GUARD,
        useClass: UserGuard,
      },
      // AwsService,
      // TradeService,
      // ProductsService,
      // CartService,
      // CategoriesService,
      // WalletService,
      // MediaService,
    ],
})
export class AppModule { }
