import { Body, Controller, Get, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Public } from 'src/users/guard/user.guard';
import { Wallet } from './schema/wallet.schema';
import { WallerDTO } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {

    constructor(private readonly walletService: WalletService) { }

    @Post("getById")
    @Public()
    async getWalletByUserID(@Body() walletDTO: WallerDTO): Promise<Wallet> {
        return await this.walletService.getBalance(walletDTO);
    }
    @Post()
    @Public()
    async createWalletWithUserID(@Body() walletDTO: WallerDTO): Promise<Wallet> {
        return await this.walletService.createBalance(walletDTO)
    }

    @Post("/incre")
    @Public()
    async increBalenceWithUserID(@Body() walletDTO: WallerDTO): Promise<Wallet> {
        return await this.walletService.increBalance(walletDTO)
    }

    @Post("/decre")
    @Public()
    async decreBalenceWithUserID(@Body() walletDTO: WallerDTO): Promise<Wallet> {
        return await this.walletService.dereBalance(walletDTO)
    }
}

