import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { Users, UsersSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {

}
