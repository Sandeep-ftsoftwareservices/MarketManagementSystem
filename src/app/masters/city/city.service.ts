import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Country } from '../country/country.component';
import { City } from './city.component';
import { State } from '../state/state.component';
import { District } from '../district/district.component';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  baseUrl = environment.apiServerUrl;
      constructor(private http: HttpClient) { }
      getEntities(): Observable<City[]> {
        return this.http.get<City[]>(`${this.baseUrl}cities/getEntities`);

        console.log(`${this.baseUrl}cities/getEntities`);
        // .pipe(response=>
        //   {
        //     return response;
        //   },shareReplay());
      }
      getDistrictDdlList(cityId:any): Observable<District[]> {
        return this.http.get<District[]>(`${this.baseUrl}Cities/GetDistrictDdl${cityId==null?'':'?cityId='+cityId}`)
        .pipe(response=>{return response;},shareReplay());
        console.log(`${this.baseUrl}cities/getEntities`);
        // .pipe(response=>
        //   {
        //     return response;
        //   },shareReplay());
      }
      getStateDdlList(countryId:any): Observable<State[]> {
        return this.http.get<State[]>(`${this.baseUrl}Countries/GetStateDdl${countryId==null?'':('?countryId='+countryId)}`)
        .pipe(response=>{return response;},shareReplay());
        // .pipe(response=>
        //   {
        //     return response;
        //   },shareReplay());
      }
      getCountryDdlList(countryId:any): Observable<Country[]> {
        return this.http.get<Country[]>(`${this.baseUrl}Countries/GetCountryDdl${countryId==null?'':'?countryId='+countryId}`)
        .pipe(response=>{return response;},shareReplay());
        // .pipe(response=>
        //   {
        //     return response;
        //   },shareReplay());
      }

      getCountryDdlId(stateId:any): Observable<Country> {
        return this.http.get<Country>(`${this.baseUrl}Countries/GetCountryDdlId${stateId==null?'':'?stateId='+stateId}`)
        .pipe(response=>{return response;},shareReplay());
        // .pipe(response=>
        //   {
        //     return response;
        //   },shareReplay());
      }

      getEntityById(id: any): Observable<City> {
        return this.http.get<City>(`${this.baseUrl}cities/getEntityById/${id}`).pipe(response => {
          return response;
        }, shareReplay());
      }
      createEntity(city: Partial<City>): Observable<City> {
        return this.http.post<City>(`${this.baseUrl}cities/CreateEntity`, city).pipe(response => {
          return response;
        });
      }
      updateEntity(changes: Partial<City>): Observable<City> {
        return this.http.put<City>(`${this.baseUrl}cities/updateEntity?Id=${changes.id}`, changes).pipe(response => {
          return response;
        });
      }
      deleteEntity(id: any): Observable<City> {
        return this.http.delete<City>(`${this.baseUrl}cities/deleteEntity?Id=${id}`).pipe(response => {
          return response;
        });
      }
}
