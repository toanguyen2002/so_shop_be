import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Refund, TradeDTO } from './dto/trade.dto';
import { HistoryService } from 'src/history/history.service';
import { TradeService } from './trade.service';
import { Public, Roles } from 'src/users/guard/user.guard';
import { WalletService } from 'src/wallet/wallet.service';
import { Products } from 'src/products/schema/product.schema';
import { ProductsService } from 'src/products/products.service';
import { ClassifyService } from 'src/classify/classify.service';
import { CartService } from 'src/cart/cart.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZaloService } from 'src/zalo/zalo.service';
import { Role } from 'src/users/enum/role.enum';
import { Trade } from './schema/trade.schema';

@Controller('trade')
export class TradeController {
  constructor(
    private readonly wallerService: WalletService,
    private readonly tradeService: TradeService,
    private readonly historyService: HistoryService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
    private readonly classifyService: ClassifyService,
    private readonly cartsService: CartService,
    private readonly mailService: MailerService,
    private readonly userService: UsersService,
    private readonly zaloService: ZaloService,
  ) {}

  // @Public()
  // @Post("/handle")
  // async cartTrade(@Body() tradeDTO: TradeDTO): Promise<any> {
  //     for (let index = 0; index < tradeDTO.products.length; index++) {
  //         console.log(tradeDTO.products[index]);
  //     }
  // }

  //chỉ là add trade and k thanh toán
  @Public()
  @Post('/add')
  async handleAddTrade(@Body() tradeDTO: TradeDTO): Promise<any> {
    const tradeIds = [];
    if (tradeDTO.products.length) {
      let totalBalence = 0;
      const trade = [];
      const promises = tradeDTO.products.map(
        async (i: { seller: any; items: any[] }) => {
          let balanceEach = 0;
          await Promise.all(
            i.items.map(
              async (item: {
                productId: string;
                classifyId: string;
                numberProduct: number;
              }) => {
                const product = await this.productsService.getProductById(
                  item.productId,
                );
                const classify = await this.classifyService.getOnelassifyById(
                  item.classifyId,
                );
                const balance = classify.price * item.numberProduct;
                totalBalence += balance;
                balanceEach += balance;
              },
            ),
          );
          trade.push({
            seller: i.seller,
            items: i.items,
            balanceEach: balanceEach,
          });
        },
      );
      await Promise.all(promises);
      await Promise.all(
        trade.map(async (item: any) => {
          if (tradeDTO.from == 'cart') {
            // const calc = await this.calcItem(item.items)
            const calc = await this.removeItemsAfterTrade(
              tradeDTO.buyer,
              item.seller,
              item.items,
            );
            const tradeId = 'TD' + randomUUID().slice(0, 10);
            if (calc) {
              const trade = await this.tradeService.addTrade({
                tradeId: tradeId,
                tradeTitle: 'Mua hàng',
                buyer: tradeDTO.buyer,
                seller: item.seller,
                products: item.items,
                sellerAccept: false, //default false => true ng bán chấp nhận và đang lien he de giao hàng
                tradeStatus: false, //đang thanh toán or
                payment: false, //chưa thanh toán
                isCancel: false, //huỷ gd
                balence: item.balanceEach,
                address: tradeDTO.address,
                dateTrade: new Date(),
                from: tradeDTO.from,
                paymentMethod: tradeDTO.paymentMethod,
                isTrade: false,
              });
              tradeIds.push(tradeId);
            }
          } else {
            const calc = await this.calcItem(item.items);
            // await this.removeItemsAfterTrade(tradeDTO.buyer, item.seller, item.items)
            const tradeId = 'TD' + randomUUID().slice(0, 10);
            if (calc) {
              const trade = await this.tradeService.addTrade({
                tradeId: tradeId,
                tradeTitle: 'Mua hàng',
                buyer: tradeDTO.buyer,
                seller: item.seller,
                products: item.items,
                sellerAccept: false, //default false => true ng bán chấp nhận và đang lien he de giao hàng
                tradeStatus: false, //đang thanh toán or
                payment: false, //chưa thanh toán
                isCancel: false, //huỷ gd
                balence: item.balanceEach,
                address: tradeDTO.address,
                dateTrade: new Date(),
                from: tradeDTO.from,
                paymentMethod: tradeDTO.paymentMethod,
                isTrade: false,
              });
              tradeIds.push(tradeId);
            }
          }
        }),
      );
    }
    return {
      tradeId: tradeIds,
      code: 200,
    };
  }

  @Roles(Role.BUYER)
  // @Public()
  @Post('accept')
  async acceptTrade(@Body() tradeDTO: TradeDTO) {
    return await this.tradeService.acceptTrade(tradeDTO);
  }

  @Public()
  @Post('cancel')
  async cancelTrade(@Body() tradeDTO: TradeDTO): Promise<any> {
    const trade = await this.tradeService.getTradeByStringId(tradeDTO.tradeId);
    if (trade.payment || trade.paymentMethod == 'zalo') {
      await this.updateCancel(trade);
      // console.log({
      //   user: tradeDTO.buyer,
      //   balance: tradeDTO.balence,
      // });

      await this.wallerService.increBalance({
        user: tradeDTO.buyer,
        balance: tradeDTO.balence,
      });
      await this.tradeService.cancelTrade(tradeDTO);
      return {
        code: 200,
        title: 'cancel success',
      };
    } else {
      this.updateCancel(trade);
      await this.tradeService.cancelTrade(tradeDTO);
      return {
        code: 200,
        title: 'cancel success',
      };
    }
  }
  @Public()
  @Post('updateStatus')
  async updateStatusTrade(@Body() tradeDTO: TradeDTO): Promise<any> {
    const trade = await this.tradeService.getTradeByStringId(tradeDTO.tradeId);
    if (trade.payment || trade.paymentMethod == 'zalo') {
      await this.updateCancel(trade);
      await this.wallerService.increBalance({
        user: tradeDTO.seller,
        balance: tradeDTO.balence,
      });
      await this.tradeService.cancelTrade(tradeDTO);
      return {
        code: 200,
        title: 'cancel success',
      };
    } else {
      this.updateCancel(trade);
      await this.tradeService.cancelTrade(tradeDTO);
      return {
        code: 200,
        title: 'cancel success',
      };
    }
  }
  @Public()
  @Get('/buyer/:id')
  async getTradeByBuyerId(@Param('id') id: string): Promise<Trade[]> {
    return await this.tradeService.getTradeByBuyerId(id);
  }
  @Public()
  @Get('/seller/:id')
  async getTradeBysellerId(@Param('id') id: string): Promise<Trade[]> {
    return await this.tradeService.getTradeBySellerId(id);
  }
  @Public()
  @Post('payment')
  async payment(@Body() tradeids: any): Promise<any> {
    switch (tradeids.method) {
      case 'zalo':
        return await this.zaloService.payment(tradeids);
      case 'cash':
        return {
          return_code: 1,
          return_message: 'Giao dịch thành công',
          sub_return_code: 1,
          sub_return_message: 'Giao dịch thành công',
          order_url: 'url//success',
        };
    }
  }

  @Public()
  @Post('callback')
  async callback(@Req() request: Request, @Res() respone: Response) {
    console.log('call...');
    return await this.zaloService.callback(request, respone);
  }
  @Public()
  @Post('refunds')
  async refunds(@Body() refund: Refund): Promise<any> {
    return await this.zaloService.refunds(refund);
  }

  @Public()
  @Post('getTradeInYear')
  async getTradeInYear(@Body() data: { userId: string }): Promise<any> {
    return this.tradeService.gettradeInYear(data.userId);
  }
  async calcItem(items: any): Promise<any> {
    await Promise.all(
      items.map(
        async (item: {
          productId: string;
          numberProduct: number;
          classifyId: string;
        }) => {
          try {
            await this.productsService.calcProduct(
              item.productId,
              item.numberProduct,
            );
            const updateClassify = await this.classifyService.calcClassify(
              item.classifyId,
              -item.numberProduct,
            );
            if (!updateClassify) {
              return false;
            }
            return true;
          } catch (error) {
            return false;
          }
        },
      ),
    );
    return true;
  }

  async removeItem(items: any): Promise<any> {
    await Promise.all(
      items.map(
        async (item: {
          productId: string;
          numberProduct: number;
          classifyId: string;
        }) => {
          try {
            await this.productsService.calcProduct(
              item.productId,
              item.numberProduct,
            );
            const updateClassify = await this.classifyService.calcClassify(
              item.classifyId,
              -item.numberProduct,
            );
            if (!updateClassify) {
              return false;
            }
            return true;
          } catch (error) {
            return false;
          }
        },
      ),
    );
    return true;
  }

  async removeItemsAfterTrade(
    buyer: string,
    seller: string,
    items: any,
  ): Promise<any> {
    await this.cartsService.removeItemsAfterTrade(buyer, seller, items);
    return true;
  }

  async updateCancel(handleCancel: any) {
    console.log(handleCancel);

    await Promise.all(
      handleCancel.products.map(async (product: any) => {
        await this.productsService.calcProduct(
          product.productId,
          -product.numberProduct,
        );
        await this.classifyService.updateClassifyByIdClassify(
          product.classifyId,
          product.numberProduct,
        );
      }),
    );
  }
  sendEmail(typeEmail: string, tradeDTO: TradeDTO) {
    this.userService.getprofile(tradeDTO.buyer);
    this.mailService.sendMail({
      to: 'toanguyen200220@gmail.com', // list of receivers
      from: 'noreply@osshop.com', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      // html: this.templateCancel({ name: "OS Shop", tradeId: tradeDTO.tradeId }), // HTML body content
      html: `
                    <div class="content">
                    <p>Dear You"}</p>

            <p>confirm that your order #[${tradeDTO.tradeId}] has been successfully</p>

            <p>Sincerely</p>
        </div>`,
    });
  }
}
