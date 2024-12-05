import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { Public } from 'src/users/guard/user.guard';
import { CartDTO } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Public()
  @Post('/add')
  async addCart(@Body() cartDTO: CartDTO) {
    const { buyer, seller, ...payload } = cartDTO;
    return await this.cartService.addCart(buyer, seller, payload);
  }

  @Public()
  @Post('/remove')
  async removeCart(@Body() cartDTO: CartDTO) {
    const { buyer, seller, ...payload } = cartDTO;
    return await this.cartService.removeCart(buyer, seller, payload);
  }
  @Public()
  @Get('checkCart')
  async checkCart() {
    console.log('l');

    return await this.cartService.getProductsTrend();
  }
  @Public()
  @Get('/:id')
  async getCart(@Param('id') id: string) {
    return await this.cartService.getCartByBuyerId(id);
  }
}
