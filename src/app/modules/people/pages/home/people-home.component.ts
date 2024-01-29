import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ActionEvent } from 'src/app/models/base/action-event';
import { DefaultActionEvent } from 'src/app/models/base/default-action-event';
import { PersonResponse } from 'src/app/models/interfaces/person/person-response';
import { PersonDataTransferService } from 'src/app/services/people/person-data-transfer.service';
import { PersonService } from 'src/app/services/people/person.service';
import { PeopleFormComponent } from '../../components/people-form/people-form.component';
import { PhoneService } from 'src/app/services/phones/phone.service';
import { PhoneFormComponent } from '../../components/phone-form/phone-form.component';

@Component({
  selector: 'app-people-home',
  templateUrl: './people-home.component.html',
  styleUrls: []
})
export class PeopleHomeComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  private ref!: DynamicDialogRef;
  public peopleList : Array<PersonResponse> = [];

  constructor(
    private personService: PersonService,
    private phoneService: PhoneService,
    private personDataTransferService: PersonDataTransferService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.getPeopleCache()
  }

  getPeopleCache() {
    let cacheList = this.personDataTransferService.getPeople();

    if(cacheList.length < 1)
    {
      this.getPeopleApi();
      return;
    }

    this.peopleList = cacheList;
  }

  getPeopleApi() : void {
    this.personService.getPeople()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (response) => {
        this.peopleList = response.result;
        this.personDataTransferService.setPeople(response.result);
      },
      error:(error) => {
        this.messageService.add({
          severity:'error',
          summary:'Erro',
          detail:'Erro ao carregar contatos!',
          life: 2000});
        console.log("Erro getPeopleApi", error);
      }
    });
  }

  //#region Person

  handlePersonEvent(event: DefaultActionEvent) : void {
    switch(event.action) {
      case ActionEvent.ADD:
        this.newPerson(event);
        break;
      case ActionEvent.EDIT:
        this.editPerson(event);
        break;
      case ActionEvent.DELETE:
        this.deletePerson(event);
        break;
      default:
        break;
    }
  }

  newPerson(event: DefaultActionEvent) : void {
    this.ref = this.dialogService.open(PeopleFormComponent, {
      header: 'Adicionar Pessoa',
      width: '70%',
      height: '90%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: event,
        person: {},
        closeDialog: () => {
          this.ref.close();
        }
      }
    });

    this.ref.onClose
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.getPeopleApi();
              },
              error: () => {
                this.messageService.add({
                  severity:'error',
                  summary:'Erro',
                  detail:'Erro ao adicionar pessoa!',
                  life: 2000
                });
              }
            });
  }

  editPerson(event: DefaultActionEvent) : void {
    this.ref = this.dialogService.open(
      PeopleFormComponent, {
      header: 'Editar Pessoa',
      width: '70%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      maximizable: true,
      transitionOptions: '1500ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      data: {
        event: event,
        person: this.peopleList.filter((person) => person.id === event.id)[0],
        closeDialog: () => {
          this.ref.close();
        }
      }
    });

    this.ref.onClose
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.getPeopleApi();
              },
              error: () => {
                this.messageService.add({
                  severity:'error',
                  summary:'Erro',
                  detail:'Erro ao alterar pessoa!',
                  life: 2000
                });
              }
            });
  }

  deletePerson(event: DefaultActionEvent) : void {
    if(!event) return;
    if(!event.id) return;

    let personName = event.name ? event.name : 'esta pessoa';
    this.confirmationService.confirm({
      header: 'Confirmar exclusão',
      message: `Deseja realmente excluir <span class="font-bold color-red">${personName}</span>?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      acceptIcon: 'pi pi-trash',
      rejectLabel: 'Não',
      accept: () => {
        this.personService.deletePerson(event.id!)
        .pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: () => {
            this.messageService.add({
              severity:'success',
              summary:'Sucesso',
              detail:`${personName} excluído com sucesso!`,
              life: 2000
            });
            this.getPeopleApi();
          },
          error: (error) => {
            console.log("Erro deletePerson", error);
            this.messageService.add({
              severity:'error',
              summary:'Erro',
              detail:'Erro ao excluir pessoa!',
              life: 2000
            });
          }
        });
      }
    });
  }

  //#endregion

  //#region Phone

  handlePhoneEvent(event: DefaultActionEvent) : void {
    switch(event.action) {
      case ActionEvent.ADD:
        this.newPhone(event);
        break;
      case ActionEvent.EDIT:
        this.editPhone(event);
        break;
      case ActionEvent.DELETE:
        this.deletePhone(event);
        break;
      default:
        break;
    }
  }

  newPhone(event: DefaultActionEvent) : void {
    this.ref = this.dialogService.open(PhoneFormComponent, {
      header: 'Adicionar Telefone',
      width: '70%',
      height: '70%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: event,
        phone: {personId : event.name},
        closeDialog: () => {
          this.ref.close();
        }
      }
    });

    this.ref.onClose
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.getPeopleApi();
              },
              error: () => {
                this.messageService.add({
                  severity:'error',
                  summary:'Erro',
                  detail:'Erro ao adicionar telefone!',
                  life: 2000
                });
              }
            });
  }

  editPhone(event: DefaultActionEvent) : void {

    let phone = this.peopleList.filter((person) => person.id === event.id)[0].phones.filter((phone) => phone.id === event.name)[0];
    console.log("Event", event);
    console.log("PhonE", phone);
    this.ref = this.dialogService.open(
      PhoneFormComponent, {
      header: 'Editar Telefone',
      width: '70%',
      height: '70%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      maximizable: true,
      transitionOptions: '1500ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      data: {
        event: event,
        phone: phone,
        closeDialog: () => {
          this.ref.close();
        }
      }
    });

    this.ref.onClose
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.getPeopleApi();
              },
              error: () => {
                this.messageService.add({
                  severity:'error',
                  summary:'Erro',
                  detail:'Erro ao alterar telefone!',
                  life: 2000
                });
              }
            });
  }

  deletePhone(event: DefaultActionEvent) : void {
    console
    if(!event) return;
    if(!event.id) return;

    let phoneNumber = event.name ? event.name : 'este telefone';
    this.confirmationService.confirm({
      header: 'Confirmar exclusão',
      message: `Deseja realmente excluir <span class="font-bold color-red">${phoneNumber}</span>?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      acceptIcon: 'pi pi-trash',
      rejectLabel: 'Não',
      accept: () => {
        this.phoneService.deletePhone(event.id!)
        .pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: () => {
            this.messageService.add({
              severity:'success',
              summary:'Sucesso',
              detail:`${phoneNumber} excluído com sucesso!`,
              life: 2500
            });
            this.getPeopleApi();
          },
          error: (error) => {
            console.log("Erro deletePhone", error);
            this.messageService.add({
              severity:'error',
              summary:'Erro',
              detail:'Erro ao excluir telefone!',
              life: 2000
            });
          }
        });
      }
    });
  }

  //#endregion

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
