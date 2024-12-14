import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MyErrorStateMatcher } from '../../my-error-state-matcher';

@Component({
  selector: 'app-state',
  imports: [MaterialModule,MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './state.component.html',
  styleUrl: './state.component.css'
})
export class StateComponent {
  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]);

  matcher = new MyErrorStateMatcher();
}
