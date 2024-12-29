import { Component } from '@angular/core';
import { District } from '../district/district.component';
import { Colony } from '../colony/colony.component';
export interface Area{
id: number;
  name: string;
  shortName: string;
  district: District;
  cityId:string;
  //stateCode: string;
  status: boolean;
  colony: Colony[];
}
@Component({
  selector: 'app-area',
  imports: [],
  templateUrl: './area.component.html',
  styleUrl: './area.component.css'
})
export class AreaComponent {

}
