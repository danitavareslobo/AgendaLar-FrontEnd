import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionEvent } from 'src/app/models/base/action-event';
import { DefaultActionEvent } from 'src/app/models/base/default-action-event';
import { PersonResponse } from 'src/app/models/interfaces/person/person-response';
import { PhoneType } from 'src/app/models/interfaces/phone/phone-type';

@Component({
  selector: 'app-people-table',
  templateUrl: './people-table.component.html',
  styleUrls: ['./people-table.component.scss']
})
export class PeopleTableComponent implements OnInit{
  @Input() people: Array<PersonResponse> = [];
  @Output() personEvent = new EventEmitter<DefaultActionEvent>();
  @Output() phoneEvent = new EventEmitter<DefaultActionEvent>();
  public addEvent = ActionEvent.ADD;
  public editEvent = ActionEvent.EDIT;
  public deleteEvent = ActionEvent.DELETE;

  ngOnInit(): void {
  }

  handlePersonEvent(action: ActionEvent, id?: string, name?: string) : void {
    if(action){
      let personEvent = id && id !== '' ? { action, id, name } : { action };
      this.personEvent.emit(personEvent);
    }
  }

  handlePhoneEvent(action: ActionEvent, id?: string, name?: string) : void {
    if(action){
      let phoneEvent = id && id !== '' ? { action, id, name } : { action };
      this.phoneEvent.emit(phoneEvent);
    }
  }

  getPhoneTypeDescription(phoneType: PhoneType) {
    switch (phoneType) {
      case PhoneType.Mobile:
        return 'Celular';
      case PhoneType.Commercial:
        return 'Comercial';
      case PhoneType.Home:
        return 'Residencial';
      case PhoneType.Other:
        return 'Outro';
      default:
        return 'Não informado';
    }
  }

  GetStatusSeverity(ativo: boolean) {
    return ativo ? 'success' : 'danger';
  }

  GetStatusDescription(ativo: boolean) {
    return ativo ? '  Ativo' : '  Inativo';
  }

  GetStatusIcon(ativo: boolean) {
    return ativo ? 'pi pi-check-circle' : 'pi pi-times-circle';
  }

  getLetter(text: string): string {
    return text.charAt(0).toUpperCase();
  }
}
