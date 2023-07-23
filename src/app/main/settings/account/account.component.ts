import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: User | undefined
  isCheckError = false;

  userForm = this.builder.group({
    _id: '',
    username: '',
    password: '',
    fullname: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    email: this.builder.control('', Validators.compose([Validators.required, Validators.email, Validators.minLength(5)])),
    phoneNumber: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(12)])),
    address: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(250)])),
    gender: this.builder.control(-1, Validators.required),
    born: this.builder.control('')
  })

  ngOnInit(): void {
    this.user = this.userSrv.GetLocalUser();
    this.setValueUserForm();
  }

  setValueUserForm() {
    this.userSrv.GetUser(this.user).subscribe(result => {
      let user: User = result.data;
      if (user) {
        this.userForm.setValue({
          _id: this.user?._id || null,
          username: this.user?.username || null,
          password: this.user?.password || null,
          fullname: user.fullname,
          email: user.email || null,
          phoneNumber: user.phoneNumber || null,
          address: user.address || null,
          gender: user.gender || null,
          born: user.born || null
        })
      }
    })
  }

  updateUser() {
    if (this.userForm.valid) {
      this.userSrv.UpdateUser(this.userForm.value).subscribe(result => {
        console.warn(result)
        this.setValueUserForm();
      })
    } else {
      this.isCheckError = true;
    }
  }

  constructor(private userSrv: UserAuthService, private builder: FormBuilder) { }

}
