import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public, Roles, UserGuard } from './guard/user.guard';
import { Role } from './enum/role.enum';
import { UserDTO } from './dto/user.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }
    @Post("/login")
    @Public()
    async login(@Body() username: string, pass: string) {
        const rs = await this.service.signIn("john", "changeme")
        return rs
    }

    @Public()
    @Get('profile')
    async getByUserName(@Request() req) {
        // console.log("Public");
        return req.user
    }

    // @Public()
    @Roles(Role.BUYER)
    @Get('admin')
    async admin(@Request() req) {
        // console.log("Public");
        return req.user
    }


    @Public()
    @Post('/register')
    async register(@Body() userDTO: UserDTO) {

        // console.log(userDTO);
        return this.service.signUp(userDTO.userName, userDTO.password)

    }
}
