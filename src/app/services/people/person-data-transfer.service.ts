import { Injectable } from '@angular/core';
import { PersonResponse } from '../../models/interfaces/person/person-response';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonDataTransferService {
  public peopleDataEmitter$ = new BehaviorSubject<Array<PersonResponse> | null>(null);
  public peopleData$: Array<PersonResponse> = [];

  setPeople(persons: Array<PersonResponse>) {
    if(this.peopleData$.length > 0) {
      this.peopleDataEmitter$.next(persons);
      this.getPeople();
    }
  }
  getPeople() {
    this.peopleDataEmitter$.subscribe({
      next: (people) => {
        if(people){
          this.peopleData$ = people;
        }
      }
    });

    return this.peopleData$;
  }
}
