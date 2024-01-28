import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private userService: UserService,
    private router : Router) { }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Observable<boolean>((observer) => {
        if(this.userService.isLoggedIn()){
          observer.next(true);
        } else {
          this.router.navigate(['/home']);
          observer.next(false);
        }
      });
    }
}
