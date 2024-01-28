import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PersonResponse } from 'src/app/models/interfaces/person/person-response';
import { PersonDataTransferService } from 'src/app/services/people/person-data-transfer.service';
import { PersonService } from 'src/app/services/people/person.service';

@Component({
  selector: 'app-people-home',
  templateUrl: './people-home.component.html',
  styleUrls: []
})
export class PeopleHomeComponent implements OnInit {
  public peopleList : Array<PersonResponse> = [];

  constructor(
    private personService: PersonService,
    private personDataTransferService: PersonDataTransferService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getPeopleCache()
  }

  getPeopleCache(){
    let productList = this.personDataTransferService.getPeople();

    if(productList.length > 0)
    {
      this.peopleList = productList;
      return;
    }

    this.getPeopleApi();
  }

  getPeopleApi() : void {
    this.personService.getPeople().subscribe({
      next: (response) => {
        this.peopleList = response;
        this.personDataTransferService.setPeople(response);
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
}
