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
    return this.http.get<Country[]>(`${this.baseUrl}countries`);
    // .pipe(response=>
    //   {
    //     return response;
    //   },shareReplay());
  }
  getEntityById(id: any): Observable<Country> {
    return this.http.get<Country>(`${this.baseUrl}countries/${id}`).pipe(response => {
      return response;
    }, shareReplay());
  }
  createEntity(country: Partial<Country>): Observable<Country> {
    return this.http.post<Country>(`${this.baseUrl}countries`, country).pipe(response => {
      return response;
    });
  }
  updateEntity(changes: Partial<Country>): Observable<Country> {
    return this.http.put<Country>(`${this.baseUrl}Countries?Id=${changes.id}`, changes).pipe(response => {
      return response;
    });
  }
  deleteEntity(id: any): Observable<Country> {
    return this.http.delete<Country>(`${this.baseUrl}Countries?Id=${id}`).pipe(response => {
      return response;
    });
  }
}

