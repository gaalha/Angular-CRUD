import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// SERVICES
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        if(!this.authService.loggedIn.getValue()){
            this.router.navigate(['/login']);
        }
    }

}
