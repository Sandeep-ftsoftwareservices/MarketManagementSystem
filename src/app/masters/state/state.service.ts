import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environment/environment';
import { State } from '../state/state.component';
import { Country } from '../country/country.component';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  baseUrl = environment.apiServerUrl;
    constructor(private http: HttpClient) { }
    getEntities(): Observable<State[]> {
      return this.http.get<State[]>(`${this.baseUrl}states/getEntities`);
      // .pipe(response=>
      //   {
      //     return response;
      //   },shareReplay());
    }
    getEntityForDdl(): Observable<Country[]> {
      return this.http.get<Country[]>(`${this.baseUrl}countries/Ddl`)
      .pipe(response=>{return response;},shareReplay());
      // .pipe(response=>
      //   {
      //     return response;
      //   },shareReplay());
    }
    getEntityById(id: any): Observable<State> {
      return this.http.get<State>(`${this.baseUrl}states/getEntityById/${id}`).pipe(response => {
        return response;
      }, shareReplay());
    }
    createEntity(state: Partial<State>): Observable<State> {
      return this.http.post<State>(`${this.baseUrl}states/createEntity`, state).pipe(response => {
        return response;
      });
    }
    updateEntity(changes: Partial<State>): Observable<State> {
      return this.http.put<State>(`${this.baseUrl}states/updateEntity?Id=${changes.id}`, changes).pipe(response => {
        return response;
      });
    }
    deleteEntity(id: any): Observable<State> {
      return this.http.delete<State>(`${this.baseUrl}states/deleteEntity?Id=${id}`).pipe(response => {
        return response;
      });
    }
}
