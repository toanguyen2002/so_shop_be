export class ClassifyDTO {
    key: string
    value: string
    price: number
    stock: number
    product: string
}

export class ClassifyUpdateAllAttDTO {
    key: string
    value: string
    price: number
    stock: number
    product: string
    id: string
}
export class ClassifyUpdateDTO {
    id: string
    product: string
    numberOfClass: number
}