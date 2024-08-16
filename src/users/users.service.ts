import { Get, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersDocument, Users } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enum/role.enum';
import { UserDTO } from './dto/user.dto';
import { error } from 'console';


// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Users.name) private readonly model: Model<UsersDocument>,
        private jwtService: JwtService
    ) { }

    private readonly users = [
        {
            userId: 1,
            username: 'john',
            password: 'changeme',
            role: ["ADMIN", "BUYER", "SELLER"]
        },
        {
            userId: 2,
            username: 'maria',
            password: 'guess',
            role: ["BUYER"]

        },
    ];
    async signIn(
        username: string,
        pass: string,
    ): Promise<any> {
        const user = await this.users.find(user => user.username === username)
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        // const payload = { sub: user.userId, username: user.username };
        const { password, ...payload } = user
        return {
            username: user.username,
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(userName: string, password: string): Promise<User> {
        console.log(userName + " " + password);
        const existUser = await this.model.aggregate([{
            $match: { userName: userName }
        }])

        console.log(existUser);
        if (existUser) {
            console.log("đã vào");

            return "user đã tồn tại"
        }
        console.log("không vào");

        return await new this.model({
            userName: userName,
            password: password,
            role: ["BUYER"]
        }).save();
    }

    async getprofile(id: string): Promise<User> {
        const user = await this.model.findById(id)
        const { password, ...payload } = user
        return payload
    }

    async findByIdAndUpdateUser(): Promise<User> {

    }
}