import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ActionEvent } from 'src/app/models/base/action-event';
import { DefaultActionEvent } from 'src/app/models/base/default-action-event';
import { EditPersonRequest } from 'src/app/models/interfaces/person/edit-person-request';
import { NewPersonRequest } from 'src/app/models/interfaces/person/new-person-request';
import { PersonResponse } from 'src/app/models/interfaces/person/person-response';
import { EditPhoneRequest } from 'src/app/models/interfaces/phone/edit-phone-request';
import { NewPhoneRequest } from 'src/app/models/interfaces/phone/new-phone-request';
import { PhoneType } from 'src/app/models/interfaces/phone/phone-type';
import { PersonService } from 'src/app/services/people/person.service';

@Component({
  selector: 'app-people-form',
  templateUrl: './people-form.component.html'
})
export class PeopleFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private id: string = '';
  public personForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    socialNumber: ['', Validators.required],
    birthDate: new FormControl<Date | null>(null),
    ativo: [true, Validators.required],
    phones:  new FormControl<string[] | null>(null)
  });
  public personAction!:{
    event: DefaultActionEvent,
    person?: PersonResponse,
    closeDialog: () => void
  };
  public addEvent = ActionEvent.ADD;
  public oldPhones: EditPhoneRequest[] = [];

  constructor(
    private personService: PersonService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private dynamicDialogConfig: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.personAction = this.dynamicDialogConfig.data;
    this.id = this.personAction.person?.id || '';

    if(this.id && this.personAction.person){
      this.oldPhones = this.personAction.person?.phones.map((phone) => {
        return {
          id: phone.id,
          personId: phone.personId,
          number: phone.number,
          type: phone.type
        };
      }) || [];

      let person = {
        name: this.personAction.person.name,
        email: this.personAction.person.email,
        socialNumber: this.personAction.person.socialNumber,
        birthDate: new Date(this.personAction.person.birthDate),
        ativo: this.personAction.person.ativo,
        phones: this.personAction.person.phones.map((phone) => {
          return phone.number;
        })
      };

      this.personForm.patchValue(person);
    }

  }

  submit(): void {
    if(this.personForm.valid){
      let request = this.mapRequest();
      this.sendEvent(request);
    }
  }

  mapRequest() : NewPersonRequest | EditPersonRequest | undefined {
    switch(this.personAction.event.action){
      case ActionEvent.ADD:
        return {
          personId: 'new',
          name: this.personForm.value.name as string,
          email: this.personForm.value.email as string,
          socialNumber: this.personForm.value.socialNumber as string,
          birthDate: this.personForm.value.birthDate as Date,
          phones: this.mapPhones() as NewPhoneRequest[]
        };
      case ActionEvent.EDIT:
        return {
          id: this.id,
          personId: this.id,
          name: this.personForm.value.name as string,
          email: this.personForm.value.email as string,
          socialNumber: this.personForm.value.socialNumber as string,
          birthDate: this.personForm.value.birthDate as Date,
          ativo: this.personForm.value.ativo as boolean,
          newPhones: this.mapPhones(),
          updatedPhones: this.oldPhones
        };
      default:
        return undefined;
    }
  }

  sendEvent(request: NewPersonRequest | EditPersonRequest | undefined) {
    switch(this.personAction.event.action){
      case ActionEvent.ADD:
        this.newPerson(request as NewPersonRequest);
        break;
      case ActionEvent.EDIT:
        this.editPerson(request as EditPersonRequest);
        break;
      default:
        console.log("PersonForm sendEvent", "Evento não encontrado");
        break;
    }
  }

  newPerson(request: NewPersonRequest) {
    this.personService.newPerson(request)
        .pipe(
          takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `${response.result.name} cadastrado com sucesso!`,
              life: 3000
            });
            this.personAction.closeDialog();
            this.personForm.reset();
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: "Erro ao cadastrar pessoa" });
          }
        });
  }

  editPerson(request: EditPersonRequest) {
    this.personService.editPerson(request)
        .pipe(
          takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `${request.name} atualizado com sucesso!`,
              life: 3000
            });
            this.personAction.closeDialog();
            this.personForm.reset();
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Erro ao alterar pessoa" });
          }
        });
  }

  mapPhones(): NewPhoneRequest[] {
    if(this.personForm.value.phones){
      let result = this.personForm.value.phones.map((phone) => {
        return {
          personId: this.id,
          number: phone as string,
          type: PhoneType.Other
        };
      });

      return result;
    }
    return [];
  }

  ngOnDestroy(): void {
    this.personForm.reset();
    this.destroy$.next();
    this.destroy$.complete();
  }
}


