export interface User {
    _id?: string,
    username: string
    password: string
    fullname: string
    email: string,
    phoneNumber?: string,
    address?: string,
    gender?: number,
    born?: string,
    role?: string
}