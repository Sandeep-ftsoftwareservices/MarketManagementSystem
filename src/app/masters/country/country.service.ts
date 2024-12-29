import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { map, Observable, shareReplay } from 'rxjs';
import { Country } from './country.component';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  baseUrl = environment.apiServerUrl;
  constructor(private http: HttpClient) { }
  getEntities(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}countries/GetEntities`);
    // .pipe(response=>
    //   {
    //     return response;
    //   },shareReplay());
  }
  getEntityById(id: any): Observable<Country> {
    return this.http.get<Country>(`${this.baseUrl}countries/GetEntityById/${id}`).pipe(response => {
      return response;
    }, shareReplay());
  }
  getEntityForDdl(id: any): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}countries/Ddl`).pipe(map(res=>res.filter(x=>{x.id,x.name})),shareReplay());
  }
  createEntity(country: Partial<Country>): Observable<Country> {
    return this.http.post<Country>(`${this.baseUrl}countries/CreateEntity`, country).pipe(response => {
      return response;
    });
  }
  updateEntity(changes: Partial<Country>): Observable<Country> {
    return this.http.put<Country>(`${this.baseUrl}Countries/UpdateEntity?Id=${changes.id}`, changes).pipe(response => {
      return response;
    });
  }
  deleteEntity(id: any): Observable<Country> {
    return this.http.delete<Country>(`${this.baseUrl}Countries/DeleteEntity?Id=${id}`).pipe(response => {
      return response;
    });
  }
}

