import { Routes } from '@angular/router';
import { CountryComponent } from './masters/country/country.component';
import { StateComponent } from './masters/state/state.component';
import { TodoListComponent } from './masters/todo-list/todo-list.component';
import { CityComponent } from './masters/city/city.component';

export const routes: Routes = [
  {path:'country',component:CountryComponent},
  {path:'state',component:StateComponent},
  {path:'todo',component:TodoListComponent,},
  {path:'city',component:CityComponent,}
];
