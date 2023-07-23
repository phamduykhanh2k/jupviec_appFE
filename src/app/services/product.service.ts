import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Cart } from '../models/cart';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cartData = new EventEmitter<Product[] | []>();

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }


  GetAll() {
    return this.http.get<any>('http://localhost:8085/v1/api/products');
  }

  GetProduct(id: string) {
    return this.http.get('http://localhost:8085/v1/api/products/' + id);
  }

  AddProduct(data: any) {
    return this.http.post("http://localhost:8085/v1/api/products", data)
  }

  UpdateProduct(data: any) {
    return this.http.put("http://localhost:8085/v1/api/products", data);
  }

  DeleteProduct(id: string) {
    return this.http.delete("http://localhost:8085/v1/api/products/" + id);
  }

  localAddToCart(data: Product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');

    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      cartData.push(data);
      this.toastr.success('Bạn đã thêm ' + data.name + ' với giá ' + data.price, 'Đã thêm vào giỏ hàng')
    } else {
      cartData = JSON.parse(localCart);

      let existItem = cartData.filter((item: Product) => item._id === data._id);
      let mainProduct = cartData.filter((item: Product) => item.category === 'MainProduct');
      console.log(mainProduct.length)
      if (existItem.length === 1) {
        this.toastr.warning('Sản phẩm đã tồn tại trong giỏ hàng');
      } else {
        if (mainProduct.length === 1 && data.category === 'MainProduct') {
          this.toastr.warning('Bạn đã có 1 sản phẩm chính trong giỏ hàng');
        } else {
          cartData.push(data);
          localStorage.setItem('localCart', JSON.stringify(cartData));
          this.toastr.success('Bạn đã thêm ' + data.name + ' với giá ' + data.price, 'Đã thêm vào giỏ hàng')
        }
      }
    }
    this.cartData.emit(cartData);
  }

  localRemoveItemCart(itemId: string) {
    let localCart = localStorage.getItem('localCart');

    if (localCart) {
      let cartData = JSON.parse(localCart);
      let items = cartData.filter((item: Product) => !(item._id === itemId))

      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);

      console.log(cartData.length)

      if (cartData.length === 1) {
        localStorage.removeItem('localCart');
        this.router.navigate(['/']);
      }
    }
  }
}
