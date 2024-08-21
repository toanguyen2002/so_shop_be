export class ProductsDTO {
    productName: String
    cate: string
    brand: string
    selled: number
    dateUp: Date
    seller: string

}

export class SellProductsDTO {
    productId: string
    classifyId: string
    numberProduct: number
    buyer: string
}

export class ProductsSearchStringDTO {
    productName: string
    brand: string
}