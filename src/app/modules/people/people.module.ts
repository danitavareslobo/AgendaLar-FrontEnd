import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';


import { PeopleRoutes } from './people.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { PeopleHomeComponent } from './pages/home/people-home.component';


@NgModule({
  declarations: [
    PeopleHomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(PeopleRoutes),
    // PrimeNg
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    SharedModule
  ],
  providers: [
    MessageService,
    CookieService
  ],
})
export class PeopleModule { }
