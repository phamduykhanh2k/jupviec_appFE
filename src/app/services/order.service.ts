import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  GetAll() {
    return this.http.get<any>('http://localhost:8085/v1/api/orders');
  }

  AddOrder(data: any) {
    return this.http.post<any>('http://localhost:8085/v1/api/orders', data)
  }

  DeleteOrder(id: any) {
    return this.http.delete('http://localhost:8085/v1/api/orders', id)
  }
}
