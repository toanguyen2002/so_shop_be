import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';
@Injectable()
export class ZaloService {
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
            merchantinfo: "embeddata123"
        };


        const order = {
            appid: config.appid,
            apptransid: `${this.formatDate(new Date)}_${randomUUID()}`, // mã giao dich có định dạng yyMMdd_xxxx
            appuser: "demo",
            apptime: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embeddata: JSON.stringify(embeddata),
            amount: 20000,
            description: "",
            // bankcode: "zalopayapp",
            mac: "",
            callback_url: "http://localhost:4000/trade/callback"
        };
        const data = config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
        try {
            const rs = await axios.post(config.endpoint, null, { params: order })
            return rs.data;
        } catch (error) {
            return error
        }
    }

    async callback(req, res) {
        let result = {
            returncode: 0,
            returnmessage: ""
        };
        const config = {
            key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
        };

        try {
            let dataStr = req.body.data;
            let reqMac = req.body.mac;

            let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
            console.log("mac =", mac);


            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (reqMac !== mac) {
                // callback không hợp lệ
                result.returncode = -1;
                result.returnmessage = "mac not equal";
            }
            else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                let dataJson = JSON.parse(dataStr, (key, value) => {
                    if (key === 'key2') {
                        // Do something with value
                        return value; // Return the transformed value
                    }
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
}
