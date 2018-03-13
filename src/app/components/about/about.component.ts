import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
//import { LogoutComponent } from '../../auth/dialogs/logout/logout.component';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {
    title: string = 'Cerrar Sesión';
    message: string = 'Seguro que desea cerrar sesión?';

    constructor(public dialog: MatDialog) { }

    /*openDialog(): void {
        let dialogRef = this.dialog.open(LogoutComponent, {
            width: '250px',
            data: { title: this.title, message: this.message }
        });
    }*/
}