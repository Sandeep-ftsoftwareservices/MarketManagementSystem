import { Component } from '@angular/core';
import { Area } from '../area/area.component';
export interface Colony {
  id: number;
  name: string;
  shortName: string;
  area: Area;
  cityId: string;
  status: boolean;
}
@Component({
  selector: 'app-colony',
  imports: [],
  templateUrl: './colony.component.html',
  styleUrl: './colony.component.css'
})
export class ColonyComponent {

}
