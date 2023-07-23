import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  productList: any[] = [];
  productStore: any;
  p: number = 1;

  ngOnInit(): void {
    this.productSrv.GetAll().subscribe((result) => {
      this.productStore = result;
      this.productList = this.productStore.data;
    })
  }

  constructor(private productSrv: ProductService, private toastr: ToastrService, private router: Router) { }

  filter(data: string) {
    if (data === 'All') {
      this.productList = this.productStore.data;
    } else {
      const result = this.productStore.data.filter((v: any) => {
        return v.categories === data;
      })
      this.productList = result;
    }
    this.p = 1;
  }
}
