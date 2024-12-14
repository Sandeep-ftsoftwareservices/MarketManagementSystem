import { Routes } from '@angular/router';
import { CountryComponent } from './masters/country/country.component';
import { StateComponent } from './masters/state/state.component';

export const routes: Routes = [
  {path:'country',component:CountryComponent},
  {path:'state',component:StateComponent},

];
