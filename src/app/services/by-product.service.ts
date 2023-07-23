import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ByProduct } from '../models/byProduct';

@Injectable({
  providedIn: 'root'
})
export class ByProductService {

  constructor(private http: HttpClient) { }

  GetAll() {
    return this.http.get<any>('http://localhost:8085/v1/api/byProducts');
  }

  GetProduct(id: string) {
    return this.http.get('http://localhost:8085/v1/api/byProducts/' + id);
  }

  AddProduct(data: any) {
    return this.http.post("http://localhost:8085/v1/api/byProducts", data)
  }

  UpdateProduct(data: any) {
    return this.http.put("http://localhost:8085/v1/api/byProducts", data);
  }

  DeleteProduct(id: string) {
    return this.http.delete("http://localhost:8085/v1/api/products/" + id);
  }
}
