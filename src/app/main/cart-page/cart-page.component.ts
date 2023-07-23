import { Time } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ByProduct } from 'src/app/models/byProduct';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { TotalSumary } from 'src/app/models/totalSumary';
import { ByProductService } from 'src/app/services/by-product.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  productList: Product[] | undefined;
  byProducts: Product[] | undefined;
  userData: any;
  order: Order | undefined;
  isShowByProduct = false;
  totalSumary: TotalSumary = {
    subTotal: 0,
    timeNum: 1,
    total: 0
  }
  timeNum = 1;
  arrayTime: string[] | undefined
  timeStart: string | undefined
  timeEnd: string | undefined

  deliveryForm = this.builder.group({
    phoneNumber: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(13)])),
    address: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10)])),
    date: this.builder.control('', Validators.required),
    shippingStatus: this.builder.control('', Validators.required),
    note: ''
  })

  ngOnInit(): void {
    let localUser = localStorage.getItem('user');
    this.userData = localUser && JSON.parse(localUser).data;
    this.productSrv.GetAll().subscribe(result => {
      const productStore = result.data;
      this.byProducts = productStore.filter((item: Product) => {
        return item.category === 'ByProduct'
      })
    });
    this.loadCart();
  }

  loadCart() {
    let localCart = localStorage.getItem('localCart');

    if (localCart) {
      let localStore = JSON.parse(localCart);
      this.productList = localStore;
      this.totalSumary.subTotal = localStore.reduce((total: number, item: Product) => {
        return total += item.price;
      }, 0)

      this.totalSumary.timeNum = this.timeNum;

      this.totalSumary.total = this.totalSumary.subTotal * this.totalSumary.timeNum
    }
  }

  removeItemCart(itemId: string) {
    this.productSrv.localRemoveItemCart(itemId);
    this.loadCart();
    this.toastr.success('Bạn đã loại 1 sản phẩm')
  }

  checkOut() {
    if (this.deliveryForm.valid) {
      let orderData = {
        userId: this.userData._id,
        phoneNumber: this.deliveryForm.value.phoneNumber,
        dateWork: this.deliveryForm.value.date,
        timeWork: this.timeNum,
        timeStart: this.timeStart,
        timeEnd: this.timeEnd,
        address: this.deliveryForm.value.address,
        note: this.deliveryForm.value.note,
        totalPrice: this.totalSumary.total,
        products: this.productList,
        status: 'Chờ xác nhận',
        shippingStatus: this.deliveryForm.value.shippingStatus
      }

      this.orderSrv.AddOrder(orderData).subscribe((result) => {
        if (result.errorCode === 0) {
          this.toastr.success('Đặt hàng thành công')
          localStorage.removeItem('localCart');
          this.productSrv.cartData.emit([])
          this.router.navigate([''])

        } else {
          this.toastr.error('Đặt hàng thất bại')
        }
      })

    } else {
      this.toastr.warning('Dữ liệu nhập vào từ 10 ký tự trở lên', 'Dữ liệu nhập vào không hợp lệ')
    }
  }

  addToCart(data: Product) {
    this.productSrv.localAddToCart(data);
    this.loadCart();
  }

  handleQuantity(type: string) {
    if (this.timeNum < 4 && type === 'plus') {
      this.timeNum += 1;
      this.loadCart();
      this.loadTime();
    } else if (this.timeNum > 1 && type === 'min') {
      this.timeNum -= 1;
      this.loadCart();
      this.loadTime();
    }
  }

  onChangeTime(event: Event): void {
    this.timeStart = (event.target as HTMLInputElement).value;
    this.arrayTime = this.timeStart.split(':');
    this.loadTime();
  }

  loadTime() {
    if (this.arrayTime) {
      let timeEnd = (+this.arrayTime[0] + this.timeNum) + ':' + this.arrayTime[1];
      this.timeEnd = timeEnd;
    }
  }

  constructor(private productSrv: ProductService, private toastr: ToastrService,
    private orderSrv: OrderService, private router: Router, private builder: FormBuilder,
    private byProductSrv: ByProductService) { }

}
