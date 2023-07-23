import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private http: HttpClient, private router: Router) { }

  GetAll() {
    return this.http.get('http://localhost:8085/v1/api/users');
  }

  GetUser(data: any) {
    return this.http.post<any>('http://localhost:8085/v1/api/user', data);
  }

  UpdateUser(data: any) {
    return this.http.put<any>('http://localhost:8085/v1/api/user', data);
  }

  SignUp(data: any) {
    return this.http.post('http://localhost:8085/v1/api/users', data);
  }

  IsLoggedIn() {
    return localStorage.getItem('user') != null;
  }

  GetUserRole() {
    return localStorage.getItem('user') != null ? localStorage.getItem('user') : undefined;
  }

  GetLocalUser() {
    let localUser = localStorage.getItem('user') != null ? localStorage.getItem('user') : undefined;
    if (localUser) {
      let user: User = JSON.parse(localUser).data;
      return user;
    }
    return undefined;
  }
}
