import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
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
    private readonly mailSrevice: MailerService,
  ) {}

  @Public()
  @Post('/register')
  async register(@Body() userDTO: UserDTO) {
    return await this.service.signUp(userDTO.userName, userDTO.password);
  }

  @Public()
  @Post('/admin')
  async init(@Body() userDTO: UserDTO) {
    return await this.service.admin();
  }

  @Public()
  @Post('/login')
  async login(@Body() userDTO: UserDTO) {
    const rs = await this.service.signIn(userDTO.userName, userDTO.password);
    return rs;
  }

  @Public()
  @Post('/reset')
  async reset(@Body() userDTO: UserDTO) {
    const rs = await this.service.resetPassWord(userDTO);
    return rs;
  }

  @Roles(Role.BUYER)
  @Get('profile/:id')
  async getByUserName(@Param('id') id: string) {
    return await this.service.getprofile(id);
  }

  // @Roles(Role.BUYER)
  // @Get('admin')
  // async admin(@Request() req) {
  //     return req.user
  // }

  @Roles(Role.BUYER)
  @Post('/update')
  async updateByUser(@Body() userDTO: UserDTO) {
    return await this.service.findByIdAndUpdateUser(userDTO);
  }
  @Roles(Role.ADMIN)
  // @Public()
  @Post('/admin/update')
  async updateSeller(@Body() data: { id: string }) {
    return await this.service.acceptSeller(data.id);
  }

  // @Public()
  @Roles(Role.BUYER)
  @Post('/buyer/register')
  async registerSeller(@Body() data: { id: string }) {
    return await this.service.registerSeller(data.id);
  }
  @Roles(Role.ADMIN)
  // @Public()
  @Get('/admin/getSeller')
  async getSeller() {
    return await this.service.findAllRegisterUser();
  }
  @Public()
  @Post('sendOTP')
  async getOTP(@Body() user: UserDTO) {
    const exitsUser = await this.service.checkMail(user.userName);
    console.log(exitsUser);

    if (exitsUser > 0) {
      return {
        code: 500,
        status: 'Email is exist in Systerm',
      };
    }
    let randomOTPnumber = '';
    for (let index = 0; index < 6; index++) {
      randomOTPnumber += Math.floor(Math.random() * 10).toString();
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
        </div>`,
      });
      return randomOTPnumber;
    } catch (error) {
      throw new ExceptionsHandler();
    }
  }
  @Public()
  @Get('findtop10')
  async findTop10() {
    return await this.service.top10brand();
  }
  @Public()
  @Post('changePass')
  async changePass(@Body() data: { userName: string; passW: string }) {
    return await this.service.changePassWord({
      newPass: data.passW,
      userName: data.userName,
    });
  }
  @Public()
  @Post('checkNum')
  async checkNum(@Body() data: { userName: string; number: string }) {
    return await this.service.checkNum(data.userName, data.number);
  }
  @Public()
  @Post('createOTP')
  async createOTP(@Body() data: { userName: string }) {
    return await this.service.createOTP(data.userName);
  }
}
