import { Time } from "@angular/common";
import { Cart } from "./cart";
import { Product } from "./product";

export interface Order {
    _id?: string,
    userId: string,
    phoneNumber: string,
    dateWork: string,
    timeWork: number,
    timeStart: Time,
    timeEnd: Time,
    address: string,
    note: string,
    totalPrice: number,
    products: Product[],
    status: string,
    shippingStatus: string,
    createdAt: string
}