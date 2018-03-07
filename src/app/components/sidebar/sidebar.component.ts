import { Component, OnInit } from '@angular/core';

// LOGOUT CONFIRM DIALOG
import { MatDialog } from '@angular/material';
import { LogoutComponent } from '../../auth/dialogs/logout/logout.component';

@Component( {
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: [ './sidebar.component.css' ]
} )

export class SidebarComponent implements OnInit {
    sidenavWidth = 4;
    title: string = 'Cerrar Sesión';
    message: string = 'Seguro que desea cerrar sesión?';

    constructor ( public dialog: MatDialog ) { }

    openDialog(): void {
        let dialogRef = this.dialog.open(LogoutComponent, {
            width: '250px',
            data: { title: this.title, message: this.message }
        });
    }

    increase () {
      this.sidenavWidth = 15;
    }

    decrease () {
      this.sidenavWidth = 4;
    }

    ngOnInit () {
    }

}
