export class ProductsDTO {
    productName: String
    cate: string
    brand: string
    selled: number
    dateUp: Date
    seller: string
    images: []

}

export class ProductsUpdateDTO {
    id: string
    productName: String
    cate: string
    brand: string
    selled: number
    dateUp: Date
    seller: string
    images: []

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