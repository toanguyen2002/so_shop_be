import { Injectable, Req } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';
import { WalletService } from 'src/wallet/wallet.service';
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
    async payment(user: string, amount: number, items: any) {
        // APP INFO
        const config = {
            appid: "554",
            key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
            key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
            endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
        };

        const embeddata = {
            merchantinfo: "embeddata123",
            redirecturl: "https://b95e-2402-800-63e9-18a5-5db4-c72c-9a53-40a2.ngrok-free.app/products"
        };


        const order = {
            appid: config.appid,
            apptransid: `${this.formatDate(new Date)}_${randomUUID()}`, // mã giao dich có định dạng yyMMdd_xxxx
            appuser: user,
            apptime: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embeddata: JSON.stringify(embeddata),
            amount: 50000,
            //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
            //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
            // callback_url: 'https://b95e-2402-800-63e9-18a5-5db4-c72c-9a53-40a2.ngrok-free.app/trade/callback',
            description: `Lazada - Payment for the order #${items}`,
            bankcode: '',
            mac: ""
        };
        const data = config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
        // console.log(order.mac);

        try {
            const rs = await axios.post(config.endpoint, null, { params: order })
            return rs.data;
        } catch (error) {
            return error
        }
    }

    async callback(@Req() req: any, res) {
        let result = {
            returncode: 0,
            returnmessage: ""
        };
        const config = {
            key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny"
        };

        try {
            let dataStr = req.body.data;
            let reqMac = req.body.mac;
            let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();


            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (reqMac !== mac) {
                // callback không hợp lệ
                console.log("mac =", mac);

                result.returncode = -1;
                result.returnmessage = "giao Dịch Thất Bại";
            }
            else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                let dataJson = JSON.parse(dataStr, (key, value) => {
                    if (key === 'key2') {
                        console.log(dataJson);

                        // Do something with value
                        return value; // Return the transformed value
                    }
                    console.log(dataJson);

                    return value; // Default return value
                });
                console.log("update order's status = success where apptransid =", dataJson["apptransid"]);

                result.returncode = 1;
                result.returnmessage = "success";
            }
        } catch (ex) {
            result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.returnmessage = ex.message;
        }

        // thông báo kết quả cho ZaloPay server
        res.json(result);
    }

    async refunds(req, res) {
        const config = {
            appid: "554",
            key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
            key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
            endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
        };

        const timestamp = Date.now();
        const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`; // unique id

        let params = {
            appid: config.appid,
            mrefundid: `${this.formatDate(new Date)}_${config.appid}_${uid}`,
            timestamp, // miliseconds
            zptransid: '190508000000022',
            amount: '50000',
            description: 'ZaloPay Refund Demo',
            mac: ""
        };

        // appid|zptransid|amount|description|timestamp
        let data = params.appid + "|" + params.zptransid + "|" + params.amount + "|" + params.description + "|" + params.timestamp;
        params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        axios.post(config.endpoint, null, { params })
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    }
}
