import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {

  showLogin = true;
  userData: any

  ngOnInit(): void {
    this.refreshUser();
  }

  constructor(private userService: UserAuthService, private builder: FormBuilder, private toastr: ToastrService, private router: Router) { }

  signUpForm = this.builder.group({
    fullname: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    username: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    password: this.builder.control('', Validators.compose([Validators.required])),
    rePassword: this.builder.control('', Validators.compose([Validators.required]))
  })

  loginForm = this.builder.group({
    username: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    password: this.builder.control('', Validators.compose([Validators.required]))
  })

  login(): void {
    if (this.loginForm.valid) {
      let formData = this.loginForm.value;

      this.userService.GetUser(formData).subscribe((result) => {
        this.userData = result;

        if (this.userData.data != null && formData.password == this.userData.data.password) {
          localStorage.setItem('user', JSON.stringify(result));
          this.toastr.success('Đăng nhập thành công');
          this.router.navigate(['']);
        } else {
          this.toastr.error('Tài khoản hoặc mật khẩu không chính xác', 'Đăng nhập thất bại')
        }
      })
    } else {
      this.toastr.warning('Dữ liệu nhập vào không hợp lệ')
    }
  }

  signUp() {
    if (this.signUpForm.valid) {
      let formData = this.signUpForm.value;
      if (formData.password === formData.rePassword) {
        if (formData) {
          this.userService.GetUser(formData).subscribe(result => {
            let storeResult: any = result;
            if (storeResult.errorCode === 0 && storeResult.data) {
              this.toastr.error('Tài khoản đã được sử dụng')
            } else {
              this.userService.SignUp(formData).subscribe(result => {
                let storeResult: any = result;
                if (storeResult.errorCode === 0) {
                  this.toastr.success('Đăng ký thành công');
                  this.openLogin();
                } else {
                  this.toastr.error('Hệ thống đang gặp sự cố');
                }
              })
            }
          })
        }
      } else {
        this.toastr.warning('Mật khẩu không trùng khớp')
      }
    } else {
      this.toastr.warning('Dữ liệu nhập vào không hợp lệ')
    }
  }

  openLogin() {
    this.showLogin = true;
  }

  openSignUp() {
    this.showLogin = false;
  }

  isLogin() {
    return localStorage.getItem('user');
  }

  refreshUser() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['']);
    }
  }
}
