import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { MaterialModule } from '../../../../material/material.module';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-confirmation-dialog-box',
    standalone:true,
    imports:[MaterialModule,MatCardModule],
    templateUrl: './confirmation-dialog-box.component.html',
    styleUrls: ['./confirmation-dialog-box.component.css']
})
export class ConfirmationDialogBoxComponent implements OnInit {

    typeOfAction: string;
    itemName: string;

    // @ts-ignore
    constructor(private dialogRef: MatDialogRef<ConfirmationDialogBoxComponent>, @Inject(MAT_DIALOG_DATA) data) {
        this.itemName = data['itemName'];
        this.typeOfAction = data['typeOfAction'];
    }

    ngOnInit() {
    }

    action(action: boolean) {
        this.dialogRef.close(action);
    }

}
