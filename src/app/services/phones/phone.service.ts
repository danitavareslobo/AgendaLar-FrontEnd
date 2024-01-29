import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { environment } from 'src/app/environments/environments';
import { DefaultListResponse, DefaultResponse } from 'src/app/models/base/default-response';
import { PhoneResponse } from 'src/app/models/interfaces/phone/phone-response';
import { NewPhoneRequest } from 'src/app/models/interfaces/phone/new-phone-request';
import { EditPhoneRequest } from 'src/app/models/interfaces/phone/edit-phone-request';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {
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

  getPhones(): Observable<DefaultListResponse<PhoneResponse>> {
    return this.httpClient
                .get<DefaultListResponse<PhoneResponse>>(`${this.API_URL}/telefones`, this.httpOptions);
  }

  getPhone(id: string): Observable<DefaultResponse<PhoneResponse>> {
    return this.httpClient
                .get<DefaultResponse<PhoneResponse>>(`${this.API_URL}/telefones/${id}`, this.httpOptions);
  }

  getPhonesByPersonId(personId: string): Observable<DefaultListResponse<PhoneResponse>> {
    return this.httpClient
                .get<DefaultListResponse<PhoneResponse>>(`${this.API_URL}/telefones/person/${personId}`, this.httpOptions);
  }

  newPhone(request: NewPhoneRequest): Observable<DefaultResponse<PhoneResponse>> {
    return this.httpClient
                .post<any>(`${this.API_URL}/telefones`, request, this.httpOptions);
  }

  editPhone(request: EditPhoneRequest): Observable<DefaultResponse<PhoneResponse>> {
    return this.httpClient
                .put<any>(`${this.API_URL}/telefones`, {
                  id: request.id,
                  personId: request.personId,
                  number: request.number,
                  type: Number(request.type)
                }, this.httpOptions);
  }

  deletePhone(id: string) : Observable<boolean> {
    return this.httpClient.delete<any>(`${this.API_URL}/telefones/${id}`, this.httpOptions);
  }
}
