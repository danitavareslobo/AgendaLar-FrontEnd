import { Injectable } from '@angular/core';
import { PersonResponse } from '../models/interfaces/person/person-response';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.JWT_TOKEN}`
    })
  };

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  getAllProducts(): Observable<Array<PersonResponse>> {
    return this.httpClient
                .get<Array<PersonResponse>>(`${this.API_URL}/pessoas`, this.httpOptions);
  }
}
