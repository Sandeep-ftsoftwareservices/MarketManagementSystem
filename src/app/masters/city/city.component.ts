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
import { MatTableDataSource } from '@angular/material/table';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SnackBarNotifierService } from '../../shared/components/ui/snack-bar/snack-bar-notifier.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogBoxComponent } from '../../shared/components/ui/confirmation-dialog-box/confirmation-dialog-box.component';
import { Country } from '../country/country.component';
import { District } from '../district/district.component';
import { CityService } from './city.service';
import { State } from '../state/state.component';
import { CountryService } from '../country/country.service';
export interface City {
  id: number;
  name: string;
  shortName: string;
  code: string;
  status: boolean;
  stateId:string;
  state: State;
  district: District[];
  }
@Component({
  selector: 'app-city',
  imports: [MaterialModule,],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
})
export class CityComponent {
  @ViewChild('formDirective')
  private formDirective!: FormGroupDirective;
  entityForm!: FormGroup;
  entity:any= {};
  row:any={};
  entities$!: Observable<City[]>;
  districtDdlItems$!: Observable<District[]>;
  stateDdlItems$!: Observable<State[]>;
  countryDdlItems$!: Observable<Country[]>;
  isLoading = true;
  isUpdateMode = false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  selectedValue:any|null;
  displayedColumns: string[] = ['id', 'name', 'shortName','code', 'state','country', 'status', 'actions'];
  dataSource: MatTableDataSource<City> = new MatTableDataSource<City>([]);

  ngOnInit() {
    this.initializeForm();
    this.getCountryDdl();
    this.getStateDdl();
    this.getDistrictDdl();
  }
  constructor(private fb: FormBuilder,
    private service: CityService,
    private snackBarNotifierService: SnackBarNotifierService,
    private dialog: MatDialog,
  ) { }

  getControl(name: any): AbstractControl | null {
    return this.entityForm.get(name);
  }

  initializeForm() {
    this.entityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
      shortName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      code: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(7)]],
      status: [false],
      countryDdl: ['-1', [Validators.required]],
      stateDdl: ['-1', [Validators.required]],
      //districtDdl: ['-1', [Validators.required]],
    });
  }

  ondistrictDllChange(districtId:any)
  {
    //find auto select state and country
  }

  onStateDllChange(stateId:any)
  {
    let c;
    this.service.getCountryDdlId(stateId)
    .subscribe(res=>{

      this.entityForm.patchValue({
        countryDdl: res[0].id});
    });
  }
  onCountryDdlChange(countryId:any)
  {
    this.stateDdlItems$ = this.service.getStateDdlList(countryId);

  }
  getCountryDdl(){
    this.countryDdlItems$ = this.service.getCountryDdlList(null);
  }
  getStateDdl(){
    this.stateDdlItems$ = this.service.getStateDdlList(null);
  }
  getDistrictDdl(){
    this.districtDdlItems$ = this.service.getDistrictDdlList(null);
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
      this.entity.stateId = form.get('stateDdl')?.value;
      this.entity.code = form.get('code')?.value;
      this.entity.status = form.get('status')?.value;

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
      this.entity = response as City;
    });
    this.getCountryDdl();
    this.getStateDdl();
    this.row = row;
    this.entityForm.patchValue({
      name: row.name,
      shortName: row.shortName,
      code: row.code,
      status: row.status,
      stateDdl:row.stateId,
      countryDdl:row.state.countryId,
    });
    this.isUpdateMode = true;
  }
  update(form: FormGroup, formDirective: FormGroupDirective) {
    if (form.valid) {
      this.entity.name = form.controls['name'].value;
      this.entity.shortName = form.controls['shortName'].value;
      this.entity.code = form.controls['code'].value;
      //this.entity.cityCode = form.controls['cityCode'].value;
      this.entity.status = form.controls['status'].value;
      this.entity.stateId = form.controls['stateDdl'].value;
      this.entity.countryId = form.controls['countryDdl'].value;
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
            //response.district = this.row.district;
            //response.state = this.row.state;

            const index = this.dataSource.filteredData.findIndex(x => x.id == this.entity.id);
            this.dataSource.data.splice(index, 1, response);
            this.dataSource.data = this.dataSource.data;
            this.snackBarNotifierService.showNotification(':: Successfully updated!!!', 'Dismiss', 'success')
            this.clear();
            //this.row = null;
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
