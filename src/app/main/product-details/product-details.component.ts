import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;

  constructor(private productSrv: ProductService, private activeRoute: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      let productId = params['id'];

      this.productSrv.GetProduct(productId).subscribe((result) => {
        let productStore: any = result;
        this.product = productStore.data;

        let cartData = localStorage.getItem('localCart');

        if (productId && cartData) {
          let items = JSON.parse(cartData);
          items = items.filter((item: any) => {
            return productId === item._id;
          });
        }
      })
    })
  }
}
