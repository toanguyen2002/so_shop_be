import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './users/guard/user.guard';
import { S3Module } from 'nestjs-s3';

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
  controllers: [AppController,],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: UserGuard,
  },],
})
export class AppModule { }
