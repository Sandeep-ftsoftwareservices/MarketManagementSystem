import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import { SnackBarComponent } from './snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarNotifierService {

  constructor(private snackbar: MatSnackBar) {
  }

  showNotification(displayMessage: string, buttonText: string, messageType: 'error' | 'success' | 'info' | 'warn') {
      return this.snackbar.openFromComponent(SnackBarComponent, {
          data: {
              message: displayMessage,
              buttonText,
              type: messageType
          },
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['redNoMatch']
      });
  }
  dismiss()
  {
    this.snackbar.dismiss();
  }
}
