import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}
  getBrands(){ return this.http.get<any[]>(`${environment.apiUrl}/brands`); }
  getCars(params:any){ return this.http.get<any[]>(`${environment.apiUrl}/cars`, { params }); }
  getCar(id:string){ return this.http.get<any>(`${environment.apiUrl}/cars/${id}`); }
  sendContact(payload:any){ return this.http.post(`${environment.apiUrl}/contact`, payload); }
}
