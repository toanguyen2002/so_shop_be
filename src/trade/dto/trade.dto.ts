export class TradeDTO {
    tradeId: string
    tradeTitle: String
    buyer: string
    seller: string
    sellerAccept: boolean //default false => true ng bán chấp nhận và đang lien he de giao hàng
    tradeStatus: boolean  //default true => false thì user sẽ hoàn tiền đã payment và cancel đơn hàng
    payment: boolean // default false => true sẽ về tiền seller
    isCancel: boolean
    products: any
    balence: number
    dateTrade: Date
    address: string
    from: string
    paymentMethod: string
    isTrade: boolean // gd dc là true k là false
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