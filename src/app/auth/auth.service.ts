import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient }  from "@angular/common/http";
import { User } from './user';
import { CONSTANTS } from '../utils/constanst';

@Injectable()
export class AuthService {
    public loggedIn = new BehaviorSubject<boolean>(this.hasToken());

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    constructor(
        private router: Router,
        public http:HttpClient
    ) {}

    login(user: User){
        if (user.userName !== '' && user.password != '' ) {
            return this.http
            .post(CONSTANTS.routes.authorization.login,{txtUserEmail:user.userName,txtPassword:user.password})
        }
    }

    logout() {
        this.router.navigate(['login']);
        this.loggedIn.next(false);
        localStorage.removeItem('token');
    }

    hasToken():boolean {
        return !!localStorage.getItem('token');
    }
}
