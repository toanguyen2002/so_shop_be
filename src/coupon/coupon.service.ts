import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupons, CouponsDocuments } from './schema/coupon.schema';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupons.name) private readonly model: Model<CouponsDocuments>,
    private readonly mailService: MailerService,
    private readonly userService: UsersService,
  ) {}

  private readonly logger = new Logger(CouponService.name);

  //   @Cron(CronExpression.EVERY_DAY_AT_9PM)
  //   handleAutoCreateCoupons() {
  //     const dateStart = new Date(
  //       new Date().getDate() +
  //         2 +
  //         '/' +
  //         new Date().getMonth() +
  //         '/' +
  //         new Date().getFullYear(),
  //     );
  //     const code = randomUUID().slice(0, 8);

  //     return new this.model({
  //       code: code,
  //       nummOf: 5,
  //       recent: 10,
  //       buyers: [],
  //       seller: null,
  //       dateStart: new Date(
  //         new Date().getDate() +
  //           '/' +
  //           new Date().getMonth() +
  //           '/' +
  //           new Date().getFullYear(),
  //       ),
  //       dateEnd: new Date(
  //         new Date().getDate() +
  //           2 +
  //           '/' +
  //           new Date().getMonth() +
  //           '/' +
  //           new Date().getFullYear(),
  //       ),
  //     }).save();
  //   }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  handleAutoNoti1() {
    const dateStart = new Date(
      new Date().getDate() +
        2 +
        '/' +
        new Date().getMonth() +
        '/' +
        new Date().getFullYear(),
    );
    this.sendEmail();
    return dateStart;
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  handleAutoNotiDemo() {
    const dateStart = new Date(
      new Date().getDate() +
        2 +
        '/' +
        new Date().getMonth() +
        '/' +
        new Date().getFullYear(),
    );
    this.sendEmail();
    return dateStart;
  }
  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  handleAutoNoti2() {
    const dateStart = new Date(
      new Date().getDate() +
        2 +
        '/' +
        new Date().getMonth() +
        '/' +
        new Date().getFullYear(),
    );
    this.sendEmail();
    return dateStart;
  }

  async sendEmail() {
    const mailer = await this.userService.getALLEmailUser();
    const listmail = mailer.map((item) => ({
      email: item.userName,
    }));
    listmail.map((item) => {
      if (item.email.endsWith('@gmail.com')) {
        this.mailService.sendMail({
          to: `${item.email}`,
          from: 'noreply@osshop.com',
          subject: 'notify from os shop ✔',
          text: 'welcome',
          html: `<a href="https://main.d3zuxjgp2skb6.amplifyapp.com/products/">GO TO THIS TO BUY PRODUCTS BRO!!😂🥹❤️😍 </a>`,
        });
      }
    });
  }
}
