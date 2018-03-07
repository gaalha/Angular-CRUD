import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';

@Component( {
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: [ './sidebar.component.css' ],
    providers: [AuthService]
} )
export class SidebarComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    sidenavWidth = 4;
    constructor ( private authService: AuthService ) { }

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
