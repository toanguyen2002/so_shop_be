import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public, Roles, UserGuard } from './guard/user.guard';
import { Role } from './enum/role.enum';
import { UserDTO } from './dto/user.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }

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

    @Roles(Role.BUYER)
    @Get('profile')
    async getByUserName(@Request() req) {
        return await req.user
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



}
