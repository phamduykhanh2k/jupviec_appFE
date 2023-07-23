import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { BehaviorSubject, flatMap } from 'rxjs';
import { Toast, ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuard).canActivate();
};

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authSrv: UserAuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authSrv.IsLoggedIn()) {
      return true;
    }

    this.router.navigate(['authentication']);
    return false;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(private authSrv: UserAuthService, private router: Router, private toastr: ToastrService) { }

  canActivate(): boolean {
    let userStore = this.authSrv.GetUserRole();
    if (userStore) {
      let userData = JSON.parse(userStore).data;
      if (userData.role === 'Quản trị viên') {
        this.toastr.success('Bạn đang truy cập bằng quyền quản trị viên')
        return true;
      }
    }
    this.toastr.warning('Bạn không có quyền truy cập')
    this.router.navigate(['authentication']);
    return false;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CartGuard {
  constructor(private productSrv: ProductService, private router: Router, private toastr: ToastrService) { }

  canActivate(): boolean {
    let cartLength = localStorage.getItem('localCart')?.length;
    if (cartLength && cartLength > 2)
      return true;
    else {
      this.toastr.warning('Giỏ hàng bị trống');
      return false;
    }
  };
}
