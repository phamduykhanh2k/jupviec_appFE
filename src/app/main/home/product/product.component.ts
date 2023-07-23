import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productList: Product[] | undefined;

  ngOnInit(): void {
    this.productSrv.GetAll().subscribe(result => {
      const productStore = result.data;
      let products = productStore.filter((item: Product) => {
        return item.category === 'MainProduct'
      })
      let size = 6;
      this.productList = products.slice(0, size);
    });
  }

  singleAddToCart(item: Product) {
    if (localStorage.getItem('user')) {
      this.productSrv.localAddToCart(item);
    } else {
      this.toastr.warning('Vui lòng đăng nhập để mua sản phẩm')
      this.router.navigate(['/authentication']);
    }
  }

  constructor(private productSrv: ProductService, private router: Router, private toastr: ToastrService) { }

}
