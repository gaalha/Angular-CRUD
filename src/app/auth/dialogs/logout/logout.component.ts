import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

// SESSION FILES
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css'],
    providers: [AuthService]
})
export class LogoutComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;

    constructor(
        private authService: AuthService,
        public dialogRef: MatDialogRef<LogoutComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit () {
        this.isLoggedIn$ = this.authService.isLoggedIn;
    }

    onLogout(){
        this.authService.logout();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}