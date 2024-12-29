import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MyErrorStateMatcher } from '../../my-error-state-matcher';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StateService } from './state.service';
import { SnackBarNotifierService } from '../../shared/components/ui/snack-bar/snack-bar-notifier.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogBoxComponent } from '../../shared/components/ui/confirmation-dialog-box/confirmation-dialog-box.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Country } from '../country/country.component';
export interface State {
  id: number;
  name: string;
  shortName: string;
  gstCode: string;
  //stateCode: string;
  status: boolean;
  country: Country;
  countryId:number;
}
@Component({
  selector: 'app-state',
  imports: [CommonModule,MatProgressSpinnerModule, MaterialModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './state.component.html',
  styleUrl: './state.component.css'
})
export class StateComponent {
  @ViewChild('formDirective')
  private formDirective!: FormGroupDirective;
  entityForm!: FormGroup;
  entity!: State;
  entities$!: Observable<State[]>;
  ddlItems$!: Observable<Country[]>;
  isLoading = true;
  isUpdateMode = false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  selectedValue:any|null;
  displayedColumns: string[] = ['id', 'name', 'shortName', 'gstCode', 'country', 'status', 'actions'];
  dataSource: MatTableDataSource<State> = new MatTableDataSource<State>([]);

  ngOnInit() {
    this.initializeForm();
    this.entity ={
      id:0,
      countryId:0,
      name:'',
      shortName:'',
      gstCode:'',
      country:{
        id: 0,
        name: '',
        shortName: '',
        code: '',
        status: false,
        state: []
      },
      status:false
    }
    this.getDdl();
  }
  constructor(private fb: FormBuilder,
    private service: StateService,
    private snackBarNotifierService: SnackBarNotifierService,
    private dialog: MatDialog,
  ) { }

  getControl(name: any): AbstractControl | null {

    return this.entityForm.get(name);
  }
  getDdl(){
    this.ddlItems$ = this.service.getEntityForDdl();
  }
  initializeForm() {
    this.entityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
      shortName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      gstCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(7)]],
      //stateCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(7)]],
      ddl: ['-1', [Validators.required]],
      status: [false],
    });
  }
  onChange(ddlValue:any)
  {

  }
  ngAfterViewInit() {
    this.entities$ = this.service.getEntities();
    //const a = this.entities$.pipe(map(r=>r.filter(course=>{return course})));
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

      this.entity.name = form.get('name')?.value;
      this.entity.shortName = form.get('shortName')?.value;
      this.entity.gstCode = form.get('gstCode')?.value;
      this.entity.status = form.get('status')?.value;
      this.entity.countryId = form.get('ddl')?.value;

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
      this.entity = response as State;
    });
    this.entityForm.patchValue({
      name: row.name,
      shortName: row.shortName,
      gstCode: row.gstCode,
      //stateCode: row.stateCode,
      status: row.status,
      ddl:row.countryId
    });
    this.isUpdateMode = true;
  }
  update(form: FormGroup, formDirective: FormGroupDirective) {
    if (form.valid) {
      this.entity.name = form.controls['name'].value;
      this.entity.shortName = form.controls['shortName'].value;
      this.entity.gstCode = form.controls['gstCode'].value;
      //this.entity.stateCode = form.controls['stateCode'].value;
      this.entity.status = form.controls['status'].value;
      this.entity.countryId = form.controls['ddl'].value;
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
