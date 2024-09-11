import { Role } from "../enum/role.enum"

export class UserDTO {
    id: string
    userName: string
    password: string
    roles: Role[]
    name: string
    avata: string
    address: string
    number: string
}