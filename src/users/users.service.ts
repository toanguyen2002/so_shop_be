import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersDocument, Users } from './schema/users.schema';
import mongoose, { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Exception } from 'handlebars/runtime';
import { MailerService } from '@nestjs-modules/mailer';

export type User = any;
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Users.name) private readonly model: Model<UsersDocument>,
        private readonly jwtService: JwtService,
        private readonly mailer: MailerService
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
                    access_token: await this.jwtService.signAsync(payload),
                    code: 200
                }
            } else {
                return {
                    status: "Mật khẩu không chính xác",
                    code: 201
                }
            }
        } else {
            return {
                status: "Tài khoản không tồn tại",
                code: 201
            }
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
            return {
                status: "user đã tồn tại",
                code: 201
            }
        }
        const hash = await bcrypt.hash(password, 10);
        return await new this.model({
            userName: userName,
            password: hash,
            isRegister: false,
            role: ["BUYER"]
        }).save();
    }

    async getprofile(id: string): Promise<User> {
        const existUser = await this.model.aggregate([{
            $match: { _id: new mongoose.Types.ObjectId(id) }
        }])
        const { password, ...payload } = existUser[0]
        return payload
    }
    async checkMail(userName: string): Promise<User> {
        const existUser = await this.model.aggregate([{
            $match: { userName: userName }
        }])
        return existUser.length
    }
    async findByIdAndUpdateUser(userDTO: UserDTO): Promise<User> {
        if (userDTO.password !== undefined) {
            const hash = await bcrypt.hash(userDTO.password, 10);
            userDTO.password = hash
            const { password, ...payload } = userDTO
            console.log(userDTO);
            try {
                await this.model.findByIdAndUpdate(userDTO.id, userDTO)
                return payload
            } catch (error) {
                throw new error
            }
        } else {
            try {
                await this.model.findByIdAndUpdate(userDTO.id, userDTO)
                return userDTO
            } catch (error) {
                throw new error
            }
        }
    }

    async registerSeller(id: string): Promise<User> {
        const existUser = await this.model.aggregate([{
            $match: { _id: new mongoose.Types.ObjectId('67111541b9b6aa43a2ef5773') }
        }])

        console.log(existUser);

        existUser[0].isRegister = true

        return await this.model.findByIdAndUpdate(id, existUser[0], { new: true })
    }

    async findAllRegisterUser(): Promise<User> {
        return await this.model.aggregate([{
            $match: { isRegister: true, role: { $nin: ["SELLER", "ADMIN"] } }
        }])
    }

    async acceptSeller(id: string): Promise<User> {
        const existUser = await this.model.aggregate([{
            $match: { _id: new mongoose.Types.ObjectId(id) }
        }])
        existUser[0].role.push('SELLER')
        return await this.model.findByIdAndUpdate(id, existUser[0], { new: true })
    }

    async resetPassWord(userDTO: UserDTO): Promise<User> {
        let newPass = ""
        for (let index = 0; index < 5; index++) {
            newPass += Math.floor(Math.random() * 10).toString()
        }
        const hash = await bcrypt.hash(newPass, 10);
        const existUser = await this.model.aggregate([{
            $match: { userName: userDTO.userName }
        }])
        if (existUser.length > 0) {
            console.log(await bcrypt.compare(newPass, hash));
            existUser[0].password = hash
            await this.model.findByIdAndUpdate(existUser[0]._id, existUser[0])
            await this.mailer
                .sendMail({
                    to: existUser[0].userName, // list of receivers
                    from: 'noreply@osshop.com', // sender address
                    subject: 'Reset Password', // Subject line
                    text: 'Dear', // plaintext body
                    // html: this.templateCancel({ name: "OS Shop", tradeId: tradeDTO.tradeId }), // HTML body content
                    html: `
                    <div class="content">
                    <p>Dear You</p>

                <p>confirm that your order reset your password</p>

                <p>${newPass} is your new password</p>

                <p>Sincerely</p>
        </div>`
                })
            return {
                status: "yêu cầu thành công",
                code: 200

            }
        } else {
            throw new Exception('can not exist!')
        }
    }
}
