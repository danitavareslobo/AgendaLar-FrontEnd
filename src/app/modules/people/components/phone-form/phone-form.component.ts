import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ActionEvent } from 'src/app/models/base/action-event';
import { DefaultActionEvent } from 'src/app/models/base/default-action-event';
import { EditPhoneRequest } from 'src/app/models/interfaces/phone/edit-phone-request';
import { NewPhoneRequest } from 'src/app/models/interfaces/phone/new-phone-request';
import { EnumOption, PhoneResponse, PhoneType } from 'src/app/models/interfaces/phone/phone-response';
import { PhoneService } from 'src/app/services/phones/phone.service';

@Component({
  selector: 'app-phone-form',
  templateUrl: './phone-form.component.html'
})
export class PhoneFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private id: string = '';
  private personId: string = '';
  public phoneForm = this.formBuilder.group({
    number: ['', Validators.required]
  });
  public phoneAction!:{
    event: DefaultActionEvent,
    phone?: PhoneResponse,
    closeDialog: () => void
  };
  public addEvent = ActionEvent.ADD;
  public selectedType!: PhoneType;
  public phoneTypeOptions: EnumOption[] = Object.keys(PhoneType).map(key => ({ label: PhoneType[Number(key)], value: key })) as EnumOption[];

  constructor(
    private phoneService: PhoneService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private dynamicDialogConfig: DynamicDialogConfig
  ) { }

  ngOnInit(): void {

    this.personId = this.dynamicDialogConfig.data.phone?.personId || '';
    this.id = this.dynamicDialogConfig.data.phone?.id || '';

    if(this.id){
      this.phoneForm.patchValue(this.dynamicDialogConfig.data.phone);
      this.selectedType = this.dynamicDialogConfig.data.phone.type;
      // this.phoneService.getPhone(this.id).subscribe({
      //   next: (response) => {
      //     console.log("res", response);
      //     this.phoneForm.patchValue({
      //       number: response.result.number
      //     });
      //     this.selectedType = response.result.type;
      //   },
      //   error: (error) => {
      //     console.log(error);
      //   }
      // });
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
          personId: 'new',
          number: this.phoneForm.value.number as string,
          type: this.selectedType
        };
      case ActionEvent.EDIT:
        return {
          id: this.id,
          personId: this.personId,
          number: this.phoneForm.value.number as string,
          type: this.selectedType
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
