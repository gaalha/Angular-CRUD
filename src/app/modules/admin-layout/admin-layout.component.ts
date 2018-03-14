import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';

// LOGOUT CONFIRM DIALOG
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '../../components/confirm/confirm.component';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.css'],
    providers: [ AuthService ]
})

export class AdminLayoutComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    
    constructor(
        private authService: AuthService,
        changeDetectorRef: ChangeDetectorRef, 
        media: MediaMatcher,
        public dialog: MatDialog
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit() {
        this.isLoggedIn$ = this.authService.isLoggedIn;
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    openDialog(): void {
        let dialogRef = this.dialog.open(ConfirmComponent, {
            width: '250px',
            data: {
                title: 'Cerrar Sesión',
                message: '¿Seguro que deseas cerrar sesión?'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.authService.logout();
            }
        });
    }
}