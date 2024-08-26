import { Injectable, Req } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';
import { WalletService } from 'src/wallet/wallet.service';
import { Refund } from 'src/trade/dto/trade.dto';
@Injectable()
export class ZaloService {
    constructor(
        private readonly walletService: WalletService
    ) { }
    formatDate(date: Date) {
        let yy = date.getFullYear().toString().slice(-2);
        let MM = (date.getMonth() + 1).toString().padStart(2, '0');
        let dd = date.getDate().toString().padStart(2, '0');
        return `${yy}${MM}${dd}`;
    }
    async payment(user: string, amount: number, itemss: any) {
        // APP INFO
        const config = {
            app_id: "2553",
            key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
            key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
            endpoint: "https://sb-openapi.zalopay.vn/v2/create"
        };
        const items = [{}];
        const embed_data = {};
        console.log(itemss);

        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${this.formatDate(new Date)}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: user,
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: amount,
            description: `Lazada - Payment for the order #${transID}`,
            bank_code: "",
            mac: "",
            callback_url: "https://5644-118-69-125-122.ngrok-free.app/trade/callback"
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
            console.log("mac =", mac);

            console.log(reqMac);


            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (reqMac !== mac) {
                console.log(false);

                // callback không hợp lệ
                result.return_code = -1;
                result.return_message = "mac not equal";
            }
            else {
                console.log(true);

                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                let dataJson = JSON.parse(dataStr, (key, value) => {
                    // Modify the value if needed
                    return value;
                });
                console.log(dataJson);
                console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

                result.return_code = 1;
                result.return_message = "success";
            }
        } catch (ex) {
            result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.return_message = ex.message;
        }

        // thông báo kết quả cho ZaloPay server
        res.json(result);
    }

    async refunds(refund: Refund) {
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

        console.log(refund);


        // appid|zptransid|amount|description|timestamp
        let data = params.app_id + "|" + params.zp_trans_id + "|" + params.amount + "|" + params.description + "|" + params.timestamp;
        params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        axios.post(config.endpoint, null, { params })
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    }


    async getTrans() {

    }
}
