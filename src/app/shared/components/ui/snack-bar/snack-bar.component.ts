import { Component, Inject, inject, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snack-bar',
  imports: [MaterialModule, CommonModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SnackBarComponent {
  private _snackBar = inject(MatSnackBar);
  // horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  // verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackbarRef: MatSnackBarRef<SnackBarComponent>
  ) {
  }
}
