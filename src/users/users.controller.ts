import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public, Roles, UserGuard } from './guard/user.guard';
import { Role } from './enum/role.enum';
import { UserDTO } from './dto/user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';


@Controller('users')
export class UsersController {
    constructor(
        private readonly service: UsersService,
        private readonly mailSrevice: MailerService
    ) { }

    @Public()
    @Post('/register')
    async register(@Body() userDTO: UserDTO) {
        return await this.service.signUp(userDTO.userName, userDTO.password)

    }

    @Public()
    @Post("/login")
    async login(@Body() userDTO: UserDTO) {
        const rs = await this.service.signIn(userDTO.userName, userDTO.password)
        return rs
    }


    @Public()
    @Post("/reset")
    async reset(@Body() userDTO: UserDTO) {
        const rs = await this.service.resetPassWord(userDTO)
        return rs
    }


    @Roles(Role.BUYER)
    @Get('profile/:id')
    async getByUserName(@Param("id") id: string) {
        return await this.service.getprofile(id)
    }

    // @Roles(Role.BUYER)
    // @Get('admin')
    // async admin(@Request() req) {
    //     return req.user
    // }

    @Roles(Role.BUYER)
    @Post("/update")
    async updateByUser(@Body() userDTO: UserDTO) {
        return await this.service.findByIdAndUpdateUser(userDTO)

    }
    @Roles(Role.ADMIN)
    @Post("/admin/update")
    @Roles(Role.ADMIN)
    async updateByAdmin() {

    }

    @Public()
    @Post("sendOTP")
    async getOTP(@Body() user) {
        let randomOTPnumber = ""
        for (let index = 0; index < 6; index++) {
            randomOTPnumber += Math.floor(Math.random() * 10).toString()
            // console.log(Math.round(Math.));
        }
        try {
            await this.mailSrevice.sendMail({
                to: user.userName, // list of receivers
                from: 'noreply@osshop.com', // sender address
                subject: 'OTP from os shop ✔', // Subject line
                text: 'welcome',
                html: `
                    <div class="content">
                    <p>Dear </p>

            <p>Your OTP IS ${randomOTPnumber}</p>
        </div>`
            })
            return randomOTPnumber
        } catch (error) {
            throw new ExceptionsHandler
        }
    }



}
