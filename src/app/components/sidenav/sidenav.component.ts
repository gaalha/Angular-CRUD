import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Observable } from 'rxjs/Observable';


// LOGOUT CONFIRM DIALOG
import { MatDialog } from '@angular/material';
import { LogoutComponent } from '../../auth/dialogs/logout/logout.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

export class SidenavComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    
    constructor(
        changeDetectorRef: ChangeDetectorRef, 
        media: MediaMatcher,
        public dialog: MatDialog
    ){
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
    ngOnInit() {
    }
    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    openDialog(): void {
        let dialogRef = this.dialog.open(LogoutComponent, {
            width: '250px',
            data: {
                title: 'Cerrar Sesión',
                message: '¿Seguro que deseas cerrar sesión?'
            }
        });
    }
}