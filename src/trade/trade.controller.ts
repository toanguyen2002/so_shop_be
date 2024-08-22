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
import { randomUUID } from 'crypto';
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
            // const trade = await this.tradeService.addTrade(
            //     {
            //         tradeStatus: "pendding",
            //         buyer: tradeDTO.buyer.toString(),
            //         seller: tradeDTO.products[index].userSellId.toString(),
            //         tradeId: (await bcrypt.hash(new Date().toString(), 10)).toString(),
            //         tradeTitle: "buy products at " + new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear(),
            //         sellerAccept: false,
            //         products: undefined
            //     })
            // await this.historyService.createHistories({ idTrade: trade.tradeId, total: totalBalence, tradeItem: sellProductsDTO, userHis: trade.buyer.toString() });
        }
    }

    @Public()
    @Post("/add")
    async handleAddTrade(@Body() tradeDTO: TradeDTO): Promise<any> {
        if (tradeDTO.products.length) {
            let totalBalence = 0;
            const trade = []
            const promises = tradeDTO.products.map(async (i: { seller: any, items: any[]; }) => {
                let balanceEach = 0
                await Promise.all(i.items.map(async (item: { productId: string; classifyId: string; numberProduct: number; }) => {
                    const product = await this.productsService.getProductById(item.productId);
                    const classify = await this.classifyService.getOnelassifyById(item.classifyId);
                    const balance = classify.price * item.numberProduct;
                    totalBalence += balance;
                    balanceEach += balance
                }))
                trade.push({ seller: i.seller, items: i.items, balanceEach: balanceEach })
            });
            await Promise.all(promises);
            const wallet = await this.wallerService.getBalance({ user: tradeDTO.buyer, balance: 0 })
            if (totalBalence <= wallet.balance) {
                await Promise.all(trade.map(async (item: any) => {
                    const calc = await this.calcItem(item.items)
                    this.removeItemsAfterTrade(tradeDTO.buyer, item.seller, item.items)
                    if (calc) {
                        this.wallerService.dereBalance({ user: tradeDTO.buyer, balance: item.balanceEach })
                        this.tradeService.addTrade({
                            tradeId: "TD" + randomUUID(),
                            tradeTitle: "trade mua hàng",
                            buyer: tradeDTO.buyer,
                            seller: item.seller,
                            products: item.items,
                            sellerAccept: false, //default false => true ng bán chấp nhận và đang lien he de giao hàng
                            tradeStatus: true,  //default true => false thì user sẽ hoàn tiền đã payment và cancel đơn hàng
                            payment: false,//true thì tiền về seller
                            balence: item.balanceEach,
                        })
                        // removeItemsAfterTrade(buyer: string, seller: string, item: any
                    }
                }))
                return {
                    statusCode: 200,
                    errorcontent: " Đủ Tiền Thanh Toán"
                }
            } else {
                return {
                    statusCode: 400,
                    errorcontent: "Không Đủ Tiền Thanh Toán"
                }
            }


        } else {
            console.log(tradeDTO.products.productId);
            console.log(tradeDTO.products.classifyId);
            console.log(tradeDTO.products.numberProduct);
        }
    }

    @Public()
    @Post("cancel")
    async handleCancelTradeByTradeId(@Body() tradeDTO: TradeDTO) {
        const trade = await this.tradeService.getTradeByTradeId(tradeDTO)
        const his = await this.historyService.getHistoriesByTradeId(tradeDTO.tradeId)
        switch (tradeDTO.tradeStatus) {
            case false:
                switch (typeof trade[0].histories[0].tradeItem) {
                    case "object":
                        this.updateCancel(trade[0].histories[0])
                        break
                    default:
                        console.log("array");
                }
                break;
            case true:
                console.log("success");
                break;
            default:
                console.log("pedding");

        }
        return trade[0]
    }
    async calcItem(items: any): Promise<any> {
        await Promise.all(items.map(async (item: { productId: string; numberProduct: number; classifyId: string; }) => {
            try {
                await this.productsService.calcProduct(item.productId, item.numberProduct)
                const updateClassify = await this.classifyService.calcClassify(item.classifyId, -item.numberProduct)
                if (!updateClassify) {
                    return false
                }
                return true
            } catch (error) {
                return false
            }
        }))
        return true
    }

    async removeItem(items: any): Promise<any> {
        await Promise.all(items.map(async (item: { productId: string; numberProduct: number; classifyId: string; }) => {
            try {
                await this.productsService.calcProduct(item.productId, item.numberProduct)
                const updateClassify = await this.classifyService.calcClassify(item.classifyId, -item.numberProduct)
                if (!updateClassify) {
                    return false
                }
                return true
            } catch (error) {
                return false
            }
        }))
        return true
    }

    async removeItemsAfterTrade(buyer: string, seller: string, items: any): Promise<any> {
        await Promise.all(items.map(async (item: { productId: string; numberProduct: number; classifyId: string; }) => {
            try {
                await this.productsService.calcProduct(item.productId, item.numberProduct)
                const updateClassify = await this.classifyService.calcClassify(item.classifyId, -item.numberProduct)
                this.cartsService.removeItemsAfterTrade(buyer, seller, item)
                if (!updateClassify) {
                    return false
                }
                return true
            } catch (error) {
                return false
            }
        }))
        return true
    }

    async updateCancel(handleCancel: any) {
        await this.wallerService.increBalance({ user: handleCancel.tradeItem.userId, balance: handleCancel.total })
        await this.productsService.calcProduct(handleCancel.tradeItem.productId, -handleCancel.tradeItem.numberProduct)
        await this.classifyService.updateClassifyByIdClassify(handleCancel.tradeItem.classifyId, handleCancel.tradeItem.numberProduct)
    }
}
