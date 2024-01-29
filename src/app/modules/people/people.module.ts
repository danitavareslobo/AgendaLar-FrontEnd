import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { PeopleTableComponent } from './components/people-table/people-table.component';
import { PeopleHomeComponent } from './pages/home/people-home.component';
import { PeopleFormComponent } from './components/people-form/people-form.component';
import { PeopleRoutes } from './people.routing';

import { CookieService } from 'ngx-cookie-service';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { PhoneFormComponent } from './components/phone-form/phone-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { PhoneTypeDescriptionPipe } from 'src/app/pipes/phone-type/phone-type-description.pipe';

@NgModule({
  declarations: [
    PeopleHomeComponent,
    PeopleTableComponent,
    PeopleFormComponent,
    PhoneFormComponent,
    PhoneTypeDescriptionPipe
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
    DropdownModule,
    ToastModule,
    SharedModule,
    TableModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    TooltipModule,
    TagModule,
    CalendarModule,
    ChipsModule
  ],
  providers: [
    MessageService,
    CookieService,
    DialogService,
    ConfirmationService
  ],
})
export class PeopleModule { }
