import { Component } from '@angular/core';
import { City } from '../city/city.component';
import { Area } from '../area/area.component';
export interface District{
id: number;
  name: string;
  shortName: string;
  city: City;
  cityId:string;
  //stateCode: string;
  status: boolean;
  area: Area[];
}
@Component({
  selector: 'app-district',
  imports: [],
  templateUrl: './district.component.html',
  styleUrl: './district.component.css'
})
export class DistrictComponent {

}
