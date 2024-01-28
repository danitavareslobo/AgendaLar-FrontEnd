import { Input, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { HomeComponent } from './modules/home/home.component';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    //PrimeNg
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ],
  providers: [
    CookieService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
