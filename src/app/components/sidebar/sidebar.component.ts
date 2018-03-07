import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../../auth/auth.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { LogoutComponent } from '../../auth/dialogs/logout/logout.component';

@Component( {
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: [ './sidebar.component.css' ],
    providers: [AuthService]
} )
export class SidebarComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    sidenavWidth = 4;

    title: string = 'Cerrar Sesión';
    message: string = 'Seguro que desea cerrar sesión?';

    constructor ( private authService: AuthService, public dialog: MatDialog ) { }

    openDialog(): void {
        let dialogRef = this.dialog.open(LogoutComponent, {
            width: '250px',
            data: { title: this.title, message: this.message }
        });
    }

    ngOnInit () {
        this.isLoggedIn$ = this.authService.isLoggedIn;
    }

    onLogout(){
        this.authService.logout();
    }

    increase () {
      this.sidenavWidth = 15;
    }

    decrease () {
      this.sidenavWidth = 4;
    }

}
