export class TradeDTO {
    tradeId: string
    tradeTitle: String
    buyer: string
    seller: string
    sellerAccept: boolean //default false => true ng bán chấp nhận và đang lien he de giao hàng
    tradeStatus: boolean  //default true => false thì user sẽ hoàn tiền đã payment và cancel đơn hàng
    payment: boolean // default false => true sẽ về tiền seller

    products: any
    balence: number
    address: string
}

export class Refund {
    zp_trans_id: string
    amount: number
}

export class QueryTrans {
    app_id: number
    zp_trans_id: string
    mac: string
}