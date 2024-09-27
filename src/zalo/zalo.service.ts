import { Injectable, Req } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';
import { WalletService } from 'src/wallet/wallet.service';
import { Refund } from 'src/trade/dto/trade.dto';
import { TradeService } from 'src/trade/trade.service';
import { ProductsService } from 'src/products/products.service';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class ZaloService {
    constructor(
        private readonly walletService: WalletService,
        private readonly tradeService: TradeService,
        private readonly productService: ProductsService,
        private readonly mailService: MailerService,

    ) { }
    formatDate(date: Date) {
        let yy = date.getFullYear().toString().slice(-2);
        let MM = (date.getMonth() + 1).toString().padStart(2, '0');
        let dd = date.getDate().toString().padStart(2, '0');
        return `${yy}${MM}${dd}`;
    }
    async payment(trade: any) {
        // APP INFO
        const config = {
            app_id: "2553",
            key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
            key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
            endpoint: "https://sb-openapi.zalopay.vn/v2/create"
        };
        let total = 0
        const trades = []
        const ids = []
        const items = [];
        let idTrans = ""
        await Promise.all(
            trade.tradeId.map(async (e: any, i: number) => {
                idTrans += i == 0 ? `${e}` : `_${e}`
                const trade = await this.tradeService.getTradeByStringId(e)
                trades.push(trade)
                total += trade.balence
                await Promise.all(trade.products.map(async (p: any) => {
                    ids.push(p)
                }))
            })
        )

        await Promise.all(ids.map(async (e) => {

            const product = await this.productService.getProductByIdForPayment(e.productId)
            console.log(e.productId);

            items.push({ productName: product[0].productName, numberProduct: e.numberProduct })
        }))
        const embed_data = {
            redirecturl: "https://facebook.com"
        };

        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${this.formatDate(new Date)}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: idTrans,
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: total,
            description: `${idTrans}`,
            bank_code: "",
            mac: "",
            callback_url: `${process.env.URLPAYMENT}/trade/callback`,
        };
        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
        try {
            const rs = await axios.post(config.endpoint, null, { params: order })
            return rs.data
        } catch (error) {
            return error
        }
    }

    async callback(@Req() req: any, res) {
        const config = {
            key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz"
        };
        let result = {
            return_code: 0,
            return_message: ""
        };

        try {
            let dataStr = req.body.data;
            let reqMac = req.body.mac;
            let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
            if (reqMac !== mac) {
                result.return_code = -1;
                result.return_message = "mac not equal";
            }
            else {
                let dataJson = JSON.parse(dataStr, (_key, value) => {
                    return value;
                });
                // console.log(dataJson);

                await Promise.all(dataJson.app_user.split("_").map(async (e: string) => {
                    await this.tradeService.successPayment(e)
                    const trade = await this.tradeService.getTradeByStringTradeId(e);
                    this.sendEmail(trade[0].buyer, e)
                }))

                result.return_code = 1;
                result.return_message = "success";
            }
        } catch (ex) {
            result.return_code = 0;
            result.return_message = ex.message;
        }
        res.json(result);
    }

    async refunds(refund: Refund) {
        // const config = {
        //     app_id: "2553",
        //     key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
        //     key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
        //     endpoint: "https://sb-openapi.zalopay.vn/v2/refund"
        // };
        const config = {
            app_id: "2553",
            key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
            key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
            endpoint: "https://sb-openapi.zalopay.vn/v2/refund"
        };

        const timestamp = Date.now();
        const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`; // unique id
        let params = {
            app_id: config.app_id,
            m_refund_id: `${this.formatDate(new Date)}_${config.app_id}_${uid}`,
            timestamp, // miliseconds
            zp_trans_id: refund.zp_trans_id,
            amount: refund.amount,
            description: 'ZaloPay Refund',
            mac: ""
        };
        let data = params.app_id + "|" + params.zp_trans_id + "|" + params.amount + "|" + params.description + "|" + params.timestamp;
        params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        try {
            const rs = await axios.post(config.endpoint, null, { params })
            return rs.data
        } catch (error) {
            return error
        }


    }

    sendEmail(buyer: string, idTrade: string) {
        this.mailService
            .sendMail({
                to: 'toanguyen200220@gmail.com', // list of receivers
                from: 'noreply@osshop.com', // sender address
                subject: 'notify from os shop ✔', // Subject line
                text: 'welcome',
                html: `
                    <div class="content">
                    <p>Dear </p>

            <p>confirm that your order #[${idTrade}] has been successfully canceled as per your request. We apologize for any inconvenience this may have caused and are here to assist you with any future needs.</p>

            <p>If payment has already been processed, a refund will be issued to your original payment method within 7 business days. You will receive a confirmation email once the refund has been processed.</p>

            <p>If you have any further questions or need additional assistance, please feel free to contact us at htkh@os.shop or 099 900 9999.</p>

            <p>Thank you for choosing us. We look forward to serving you in the future.</p>

            <p>Sincerely</p>
        </div>`
            })
    }
}
