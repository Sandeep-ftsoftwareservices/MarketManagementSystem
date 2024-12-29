import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar'
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [],
  imports: [ReactiveFormsModule,FormsModule,MatProgressSpinnerModule,MatBadgeModule,MatSidenavModule,MatToolbarModule,
    CommonModule,MatSelectModule,
    MatCardModule, MatFormFieldModule, MatInputModule
    , MatCheckboxModule, MatIconModule,MatSnackBarModule
    , MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule
  ],
  exports:[ReactiveFormsModule,FormsModule,CommonModule,MatProgressSpinnerModule,MatBadgeModule,MatToolbarModule,MatSelectModule,MatCardModule, MatFormFieldModule, MatInputModule
    , MatCheckboxModule, MatIconModule,MatSnackBarModule
    , MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule]
})
export class MaterialModule { }
