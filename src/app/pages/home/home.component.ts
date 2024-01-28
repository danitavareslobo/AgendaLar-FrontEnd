import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
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
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router) {}

  onSubmitLogin(){
    if(this.loginForm.valid){
      this.service.login(this.loginForm.value as LoginUserRequest).subscribe({
        next: (response: UserResponse) => {
          if(response){

            console.log("response", response);
            this.cookieService.set('token', response.result.accessToken);
            this.loginForm.reset();

            this.router.navigate(['/dashboard']);
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Bem vindo, ${response.result.userToken.name}!`,
              life: 1500
            });
          }
        },
        error: (error) => {
          this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: "Erro ao realizar login",
          life: 2000
          });
          console.log("error no login", error);
        }
      });
    }
  }

  onSubmitSignup(){
    if(this.signupForm.valid){

      this.service.signup(this.signupForm.value as SignupUserRequest).subscribe({
        next: (response) =>{
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Usuário ${response.result.userToken.email} criado com sucesso!`,
            life: 1500
          });
          this.signupForm.reset();
          this.loginCard = true;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: "Erro ao realizar cadastro",
            life: 2000
          });
          console.log("error", error);
        }
      })
    };
  }
}
