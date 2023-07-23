import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuType: string = 'default';
  userData: any;
  cartQuantity = 0;

  ngOnInit(): void {
    this.router.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('user')) {
          this.menuType = 'default'
          let userStore = localStorage.getItem('user');
          this.userData = userStore && JSON.parse(userStore).data;
        } else {
          this.menuType = 'authentication'
        }
      }
    })

    let cartData = localStorage.getItem('localCart');

    if (cartData) {
      this.cartQuantity = JSON.parse(cartData).length;
    }

    this.productSrv.cartData.subscribe((items) => {
      this.cartQuantity = items.length;
    })
  }

  constructor(private router: Router, private productSrv: ProductService, private toastr: ToastrService) { }

  logout() {
    localStorage.clear();
    this.cartQuantity = 0;
    this.router.navigate([''])
  }

}
