import { Injectable } from '@angular/core';
import { PersonResponse } from '../../models/interfaces/person/person-response';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { DefaultListResponse, DefaultResponse } from 'src/app/models/base/default-response';
import { NewPersonRequest } from 'src/app/models/interfaces/person/new-person-request';
import { EditPersonRequest } from 'src/app/models/interfaces/person/edit-person-request';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Authorization': `Bearer ${this.JWT_TOKEN}`
    })
  };

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  getPeople(): Observable<DefaultListResponse<PersonResponse>> {
    return this.httpClient
                .get<DefaultListResponse<PersonResponse>>(`${this.API_URL}/pessoas`, this.httpOptions);
  }

  newPerson(request: NewPersonRequest): Observable<DefaultResponse<PersonResponse>> {
    return this.httpClient
                .post<DefaultResponse<PersonResponse>>(`${this.API_URL}/pessoas`, request, this.httpOptions);
  }

  editPerson(request: EditPersonRequest): Observable<DefaultResponse<PersonResponse>> {
    return this.httpClient
                .put<DefaultResponse<PersonResponse>>(`${this.API_URL}/pessoas`, request, this.httpOptions);
  }

  deletePerson(id: string) : Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.API_URL}/pessoas/${id}`, this.httpOptions);
  }
}
