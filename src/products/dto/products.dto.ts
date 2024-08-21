export class ProductsDTO {
    productName: String
    cate: string
    brand: string
    selled: number
    dateUp: Date
    userup: string

}

export class SellProductsDTO {
    productId: string
    classifyId: string
    numberProduct: number
    userId: string
}

export class ProductsSearchStringDTO {
    productName: string
    brand: string
}