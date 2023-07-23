import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent implements OnInit {
  isAdd = false;
  isError = false;
  isEdit = false;
  p: number = 1;
  products: Product[] = []
  productId: string | undefined
  @ViewChild('myInput') inputElement: ElementRef | undefined;

  productForm = this.builder.group({
    name: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(1000)])),
    image: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10)])),
    price: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.min(500)])),
    description: ''
  })

  constructor(private productSrv: ProductService, private builder: FormBuilder,
    private toastr: ToastrService, private activeRoute: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.productSrv.GetAll().subscribe(result => {
      let productStore: any = result;
      this.products = productStore.data;
    })
  }


  showAddProduct() {
    this.productForm.reset();
    this.isAdd = true;
    this.isEdit = false;

    setTimeout(() => {
      if (this.inputElement) {
        this.inputElement.nativeElement.focus();
      }
    })
  }

  hiddenAddProduct() {
    this.isAdd = false;
  }

  addProduct() {
    if (this.productForm.valid) {
      this.productSrv.AddProduct(this.productForm.value).subscribe(result => {
        let addResult: any = result;
        if (addResult.errorCode === 0) {
          this.toastr.success('Thêm sản phẩm thành công')
          this.loadProduct();
        } else {
          this.toastr.error('Hệ thống đang gặp sự cố')
        }
      })
    } else {
      this.isError = true;
    }
  }

  showEditProduct(product: Product) {
    this.productId = product._id;
    this.productForm.setValue({
      name: product.name,
      image: product.image,
      price: product.price + '',
      description: product.description
    })

    this.isAdd = false;
    this.isEdit = true;
    setTimeout(() => {
      if (this.inputElement) {
        this.inputElement.nativeElement.focus();
      }
    })
  }

  hiddenEditProduct() {
    this.isEdit = false;
    this.router.navigate(['/manager/products/']);
  }

  updateProduct() {
    if (this.productForm.valid) {
      let data = {
        _id: this.productId,
        name: this.productForm.value.name,
        image: this.productForm.value.image,
        price: this.productForm.value.price,
        description: this.productForm.value.description
      }

      this.productSrv.UpdateProduct(data).subscribe(result => {
        let store: any = result;
        if (store.errorCode === 0) {
          this.toastr.success('Cập nhật sản phẩm thành công');
          this.loadProduct();
          this.isEdit = false;
        } else {
          this.toastr.error('Hệ thống đang gặp sự cố')
        }
      })
    } else {
      this.isError = true;
    }
  }

  removeProduct(product: Product) {
    this.productSrv.DeleteProduct(product._id).subscribe(result => {
      let store: any = result;
      if (store.data.deletedCount > 0) {
        this.toastr.success('Xóa thành công');
        this.loadProduct();
      } else {
        this.toastr.error('Hệ thống đang gặp sự cố')
      }
    })
  }
}
