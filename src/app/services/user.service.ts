import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUserRequest } from '../models/interfaces/user/login-user-request';
import { SignupUserRequest } from '../models/interfaces/user/signup-user-request';
import { environment } from '../environments/environments';
import { CookieService } from 'ngx-cookie-service';
import { UserResponse } from '../models/interfaces/user/user-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService) { }

  signup(request: SignupUserRequest) : Observable<UserResponse>{
    return this.httpClient.post<UserResponse>(`${this.API_URL}/auth/register`, request, this.httpOptions);
  }

  login(request: LoginUserRequest) : Observable<UserResponse>{
    return this.httpClient.post<UserResponse>(`${this.API_URL}/auth/login`, request, this.httpOptions);
  }

  isLoggedIn() : boolean{
    return this.cookieService.check('token');
  }
}
