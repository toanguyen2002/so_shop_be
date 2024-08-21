import { Body, Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { TradeDTO } from './dto/trade.dto';
import { HistoryService } from 'src/history/history.service';
import { TradeService } from './trade.service';
import { Public } from 'src/users/guard/user.guard';
import { WalletService } from 'src/wallet/wallet.service';
import { Products } from 'src/products/schema/product.schema';
import { ProductsService } from 'src/products/products.service';
import { ClassifyService } from 'src/classify/classify.service';
import { CartService } from 'src/cart/cart.service';
import * as bcrypt from 'bcrypt';
@Controller('trade')
export class TradeController {
    constructor(
        private readonly wallerService: WalletService,
        private readonly tradeService: TradeService,
        private readonly historyService: HistoryService,
        @Inject(forwardRef(() => ProductsService))
        private productsService: ProductsService,
        private classifyService: ClassifyService,
        private cartsService: CartService,


    ) { }

    @Public()
    @Post("/handle")
    async cartTrade(@Body() tradeDTO: TradeDTO): Promise<any> {
        for (let index = 0; index < tradeDTO.products.length; index++) {
            console.log(tradeDTO.products[index]);


            const trade = await this.tradeService.addTrade(
                {
                    tradeStatus: "pendding",
                    buyer: tradeDTO.buyer.toString(),
                    seller: tradeDTO.products[index].userSellId.toString(),
                    tradeId: (await bcrypt.hash(new Date().toString(), 10)).toString(),
                    tradeTitle: "buy products at " + new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear(),
                    sellerAccept: false,
                    products: undefined
                })
            // await this.historyService.createHistories({ idTrade: trade.tradeId, total: totalBalence, tradeItem: sellProductsDTO, userHis: trade.buyer.toString() });
        }

        // tradeId: (await bcrypt.hash(new Date().toString(), 10)).toString(),
        // tradeStatus: "pedding"
        // tradeTitle: "Buy products"
        // buyer: string user
        // seller: string userSellId
        // sellerAccept: boolean false 





        //
    }

    @Public()
    @Post("cancel")
    async handleCancelTradeByTradeId(@Body() tradeDTO: TradeDTO) {
        const trade = await this.tradeService.getTradeByTradeId(tradeDTO)
        const his = await this.historyService.getHistoriesByTradeId(tradeDTO.tradeId)
        // console.log(typeof trade[0].histories);

        switch (tradeDTO.tradeStatus) {
            case "cancel":
                // const wallet = this.wallerService.increBalance({balance:})
                switch (typeof trade[0].histories[0].tradeItem) {
                    case "object":
                        this.updateCancel(trade[0].histories[0])
                        break
                    default:
                        console.log("array");
                }
                break;
            case "success":
                console.log("success");
                break;
            default:
                console.log("pedding");

        }
        return trade[0]
    }


    async updateCancel(handleCancel: any) {
        //hoan credit ve ng mua
        await this.wallerService.increBalance({ user: handleCancel.tradeItem.userId, balance: handleCancel.total })
        await this.productsService.calcProduct(handleCancel.tradeItem.productId, -handleCancel.tradeItem.numberProduct)
        await this.classifyService.updateClassifyByIdClassify(handleCancel.tradeItem.classifyId, handleCancel.tradeItem.numberProduct)
    }
}
