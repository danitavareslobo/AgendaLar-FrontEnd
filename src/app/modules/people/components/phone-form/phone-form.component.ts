import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArrayName, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ActionEvent } from 'src/app/models/base/action-event';
import { DefaultActionEvent } from 'src/app/models/base/default-action-event';
import { EditPhoneRequest } from 'src/app/models/interfaces/phone/edit-phone-request';
import { NewPhoneRequest } from 'src/app/models/interfaces/phone/new-phone-request';
import { PhoneResponse } from 'src/app/models/interfaces/phone/phone-response';
import { PhoneType } from 'src/app/models/interfaces/phone/phone-type';
import { EnumOption } from 'src/app/models/base/enum-option';
import { PhoneService } from 'src/app/services/phones/phone.service';
import { PhoneTypeDescriptionPipe } from 'src/app/pipes/phone-type/phone-type-description.pipe';

@Component({
  selector: 'app-phone-form',
  templateUrl: './phone-form.component.html'
})
export class PhoneFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private id: string = '';
  private personId: string = '';
  public phoneForm = this.formBuilder.group({
    number: ['', Validators.required],
    type: new FormControl<EnumOption | null>(null)
  });
  public phoneAction!:{
    event: DefaultActionEvent,
    phone?: PhoneResponse,
    closeDialog: () => void
  };
  public addEvent = ActionEvent.ADD;
  public selectedType!: EnumOption;
  public types: EnumOption[] = [];

  constructor(
    private phoneService: PhoneService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private dynamicDialogConfig: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.types = Object.keys(PhoneType).filter(k => !isNaN(Number(k))).map(k => {
      return { label: PhoneType[Number(k)], value: Number(k) };
    });
    this.personId = this.dynamicDialogConfig.data.phone?.personId || '';
    this.id = this.dynamicDialogConfig.data.phone?.id || '';
    this.phoneAction = this.dynamicDialogConfig.data;

    if(this.id && this.id !== 'empty'){
      this.phoneService.getPhone(this.id)
        .subscribe({
          next: (response) => {
            console.log(response.result);
            this.phoneForm.patchValue({
              number: response.result.number,
              type: PhoneTypeDescriptionPipe.prototype.transform(response.result.type.toString())
            });
            this.selectedType = {
              label: PhoneTypeDescriptionPipe.prototype.transform(response.result.type.toString()),
              value:  response.result.type
            };
            //set selected dropdown value

            //get enum phoneType description
            let phoneType = PhoneType[response.result.type];

            this.phoneForm.controls.type.setValue({
              label: phoneType,
              value: response.result.type
            });

            console.log("phoneType", phoneType);
            console.log(this.selectedType);
            console.log("TIPO", this.phoneForm.value.type);
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Erro ao buscar telefone" });
          }
        });
    }
    else {
      this.selectedType = {
        label: PhoneTypeDescriptionPipe.prototype.transform(PhoneType.CELULAR.toString()),
        value:  PhoneType.CELULAR
      };
      this.phoneForm.controls.type.setValue({
        label: PhoneType.CELULAR.toString(),
        value: PhoneType.CELULAR
      });
    }
  }

  submit(): void {
    if(this.phoneForm.valid){
      let request = this.mapRequest();
      this.sendEvent(request);
    }
  }

  mapRequest() : NewPhoneRequest | EditPhoneRequest | undefined {
    switch(this.phoneAction.event.action){
      case ActionEvent.ADD:
        return {
          personId: this.personId,
          number: this.phoneForm.value.number as string,
          type: this.mapPhoneType(this.phoneForm.value.type) as PhoneType
        };
      case ActionEvent.EDIT:
        return {
          id: this.id,
          personId: this.personId,
          number: this.phoneForm.value.number as string,
          type: this.mapPhoneType(this.phoneForm.value.type) as PhoneType
        };
      default:
        return undefined;
    }
  }

  sendEvent(request: NewPhoneRequest | EditPhoneRequest | undefined) {
    switch(this.phoneAction.event.action){
      case ActionEvent.ADD:
        this.newPhone(request as NewPhoneRequest);
        break;
      case ActionEvent.EDIT:
        this.editPhone(request as EditPhoneRequest);
        break;
      default:
        console.log("PhoneForm sendEvent", "Evento não encontrado");
        break;
    }
  }

  newPhone(request: NewPhoneRequest) {
    this.phoneService.newPhone(request)
        .pipe(
          takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `${response.result.number} cadastrado com sucesso!`,
              life: 3000
            });
            this.phoneAction.closeDialog();
            this.phoneForm.reset();
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: "Erro ao cadastrar telefone" });
          }
        });
  }

  editPhone(request: EditPhoneRequest) {
    this.phoneService.editPhone(request)
        .pipe(
          takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `${request.number} atualizado com sucesso!`,
              life: 3000
            });
            this.phoneAction.closeDialog();
            this.phoneForm.reset();
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Erro ao alterar telefone" });
          }
        });
  }

  mapPhoneType(type: string | EnumOption | undefined | null) : PhoneType {

    if(!type) return PhoneType.Other;

    switch(type){
      case '1':
        return PhoneType.Mobile;
      case '3':
        return PhoneType.Commercial;
      case '2':
        return PhoneType.Home;
      default:
        return PhoneType.Other;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
