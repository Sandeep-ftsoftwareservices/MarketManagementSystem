import { CountryService } from './country.service';
import { Component, NgModule, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgModel, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { MyErrorStateMatcher } from '../../my-error-state-matcher';
import { catchError, EMPTY, from, map, Observable, of, throwError } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { SnackBarComponent } from "../../shared/components/ui/snack-bar/snack-bar.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarNotifierService } from '../../shared/components/ui/snack-bar/snack-bar-notifier.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogBoxComponent } from '../../shared/components/ui/confirmation-dialog-box/confirmation-dialog-box.component';
declare var $: any;

export interface Country {
  id: number;
  name: string;
  shortName: string;
  code: string;
  isActive: boolean;
  state: [];
}


export const errorMessages: { [key: string]: string } = {
  Name: 'Name must be between 3 and 45 characters',
  ShortName: 'ShortName must be between 1 and 15 characters',
  Code: 'Code must be between 1 and 4 characters',
  IsActive: 'Password must be between 7 and 15 characters, and contain at least one number and special character',
};
@Component({
  selector: 'app-country',
  imports: [MaterialModule, MatProgressSpinner, ReactiveFormsModule, CommonModule, FormsModule,],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css'
})
export class CountryComponent implements AfterViewInit, OnInit {
  @ViewChild('formDirective')
  private formDirective!: FormGroupDirective;
  entityForm!: FormGroup;
  entity!: Country;
  entities$!: Observable<Country[]>;
  isLoading = true;
  isUpdateMode = false;
  ngOnInit() {
    this.initializeForm();
  }
  getControl(name: any): AbstractControl | null {

    return this.entityForm.get(name);
  }
  //matcher = new MyErrorStateMatcher();

  initializeForm(): void {
    this.entityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
      shortName: ['', [Validators.required, Validators.min(1), Validators.maxLength(15)]],
      code: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(7)]],
      isActive: [false]
    });
  }

  displayedColumns: string[] = ['id', 'name', 'shortName', 'code', 'isActive', 'actions'];
  dataSource: MatTableDataSource<Country> = new MatTableDataSource<Country>([]);;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private fb: FormBuilder,
    private service: CountryService,
    private snackBarNotifierService: SnackBarNotifierService,
    private dialog: MatDialog,) {
    // Create 100 users
  }

  ngAfterViewInit() {
    this.entities$ = this.service.getEntities();

    // Assign the data to the data source for the table to render
    this.entities$.subscribe(response => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    }, error => { this.isLoading = false; });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  create(form: FormGroup, formDirective: FormGroupDirective) {
    if (form.valid) {
      this.entity = form.value as Country;
      this.service.createEntity(this.entity)
        .pipe(
          catchError(error => {
            this.snackBarNotifierService.showNotification("An error occured!!!", 'Dismiss', 'error')
            const validationErrors: ValidationErrors = error.error;

            Object.keys(validationErrors).forEach(prop => {
              const formControl = this.entityForm.get(prop);
              if (formControl) {
                formControl.setErrors({
                  serverError: validationErrors[prop]
                });
              }
            });
            // Handle the error here
            //console.error('An error occurred:', error);
            // Optionally, re-throw the error or return a default value
            return EMPTY;
          })
        )
        .subscribe
        (
          response => {

            this.entities$.subscribe(datasource => {
              this.dataSource.data.splice(0, 0, response);
              this.dataSource.data = this.dataSource.data;
              this.snackBarNotifierService.showNotification(':: Successfully saved!!!', 'Dismiss', 'success')
              this.clear();
            },
              (error) => { },
              () => {
                //this.snackBarNotifierService.dismiss();

                // setTimeout(() => {

                //   //this.initializeForm();
                // }, 5000);
              }
            )
          }

        )
    }

  }
  edit(row: any) {
    console.log(row);
    this.service.getEntityById(row.id).subscribe(response => {
      this.entity = response as Country;
    });
    this.entityForm.patchValue({
      name: row.name,
      shortName: row.shortName,
      code: row.code,
      isActive: row.isActive,
    });
    this.isUpdateMode = true;
  }
  update(form: FormGroup, formDirective: FormGroupDirective) {
    if (form.valid) {
      this.entity.name = form.controls['name'].value;
      this.entity.shortName = form.controls['shortName'].value;
      this.entity.code = form.controls['code'].value;
      this.entity.isActive = form.controls['isActive'].value;
      //this.entity = form.value;
      this.service.updateEntity(this.entity).pipe(
        catchError(error => {
          this.snackBarNotifierService.showNotification("An error occured!!!", 'Dismiss', 'error')
          const validationErrors: ValidationErrors = error.error;

          Object.keys(validationErrors).forEach(prop => {
            const formControl = this.entityForm.get(prop);
            if (formControl) {
              formControl.setErrors({
                serverError: validationErrors[prop]
              });
            }
          });
          this.isUpdateMode = true;
          return EMPTY;
        })
      ).subscribe
        (
          (response) => {
            const index = this.dataSource.filteredData.findIndex(x => x.id == this.entity.id);
            this.dataSource.data.splice(index, 1, response);
            this.dataSource.data = this.dataSource.data;
            this.snackBarNotifierService.showNotification(':: Successfully updated!!!', 'Dismiss', 'success')
            this.clear();
            this.isUpdateMode = false;
          },
          (error) => {
          },
          () => {

            //this.snackBarNotifierService.dismiss();

            // setTimeout(() => {

            //   //this.initializeForm();
            // }, 5000)
          }
        );
    }
    else {
      this.snackBarNotifierService.showNotification(':: Invalid input!!!', 'Dismiss', 'error');
      this.isUpdateMode = true;
    }
  }
  delete(entity: any): void {

    const dialogRef = this.openDialog(entity.name);
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {

        this.service.deleteEntity(entity.id).subscribe(
          (response) => {
            const index = this.dataSource.filteredData.findIndex(x => x.id == entity.id);
            this.dataSource.data.splice(index, 1);
            this.dataSource.data = this.dataSource.data;
            // this.dataSource.data = this.dataSource.data.filter(
            //   (u: Country) => u.id != entity.id

            // );
            this.snackBarNotifierService.showNotification(':: Successfully deleted!!!', 'Dismiss', 'success');

          },
          (error) => {
            this.snackBarNotifierService.showNotification(':: An error occured!!!', 'Dismiss', 'error')
          },
          () => {

          }
        );
      }
      else {

      }
    });
  }

  clear(): void {
    this.formDirective.resetForm();
    this.entityForm.reset();
    this.initializeForm();
    this.isUpdateMode = false;
  }
  openDialog(data: any) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    /*dialogConfig.position = {
        'top': '0',
        left: '0'
    };*/
    dialogConfig.data = {
      itemName: data,
      typeOfAction: 'delete'
    };

    //this.snackbar = this.snackBarNotifierService.showNotification(':: Please confirm delete action!!!', 'Dismiss', 'warn');

    return this.dialog.open(ConfirmationDialogBoxComponent, dialogConfig);
  }
}


