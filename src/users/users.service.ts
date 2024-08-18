import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersDocument, Users } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

export type User = any;
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Users.name) private readonly model: Model<UsersDocument>,
        private jwtService: JwtService
    ) { }
    async signIn(
        userName: string,
        pass: string,
    ): Promise<User> {
        const existUser = await this.model.aggregate([{
            $match: { userName: userName }
        }])

        if (existUser.length > 0) {
            if (await bcrypt.compare(pass, existUser[0].password)) {
                const { password, ...payload } = existUser[0]
                return {
                    ...payload,
                    access_token: await this.jwtService.signAsync(payload)
                }
            } else {
                return "Mật khẩu không chính xác"
            }
        } else {
            return "Tài khoản không tồn tại"
        }
    }

    async signUp(
        userName: string,
        password: string)
        : Promise<User> {
        const existUser = await this.model.aggregate([{
            $match: { userName: userName }
        }])
        if (existUser.length > 0) {
            return "user đã tồn tại"
        }
        const hash = await bcrypt.hash(password, 10);
        return await new this.model({
            userName: userName,
            password: hash,
            role: ["BUYER"]
        }).save();
    }

    async getprofile(userName: string): Promise<User> {
        const existUser = await this.model.aggregate([{
            $match: { userName: userName }
        }])
        const { password, ...payload } = existUser[0]
        return payload
    }

    async findByIdAndUpdateUser(userDTO: UserDTO): Promise<User> {
        const hash = await bcrypt.hash(userDTO.password, 10);
        userDTO.password = hash
        console.log(userDTO);
        const { password, ...payload } = userDTO
        try {
            await this.model.findByIdAndUpdate(userDTO.id, userDTO)
            return payload
        } catch (error) {
            throw new error
        }
    }
}