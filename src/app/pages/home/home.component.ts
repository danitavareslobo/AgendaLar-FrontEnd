import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { LoginUserRequest } from 'src/app/models/interfaces/user/login-user-request';
import { SignupUserRequest } from 'src/app/models/interfaces/user/signup-user-request';
import { UserResponse } from 'src/app/models/interfaces/user/user-response';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    socialNumber: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private service: UserService,
    private cookieService: CookieService) {}

  onSubmitLogin(){
    if(this.loginForm.valid){
      this.service.login(this.loginForm.value as LoginUserRequest).subscribe({
        next: (response: UserResponse) => {
          if(response){
            this.cookieService.set('token', response.result.accessToken);
            this.loginForm.reset();
          }
        },
        error: (error) => console.log("error", error)
      });
    }
  }

  onSubmitSignup(){
    if(this.signupForm.valid){

      this.service.signup(this.signupForm.value as SignupUserRequest).subscribe({
        next: (response) =>{
          alert("Usuario criado com sucesso!");
          this.signupForm.reset();
          this.loginCard = true;
        },
        error: (error) => {
          console.log("error", error);
        }
      })
    };
  }
}
