import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders }  from "@angular/common/http";
import { User } from '../models/user';
import { CONSTANST } from '../utils/constanst';

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

    headers = new HttpHeaders({
        'x-access-token': localStorage.getItem('token')
    });

    login(user: User){
        if (user.userName !== '' && user.password !== '' ) {
            return this.http
            .post(CONSTANST.routes.authorization.login,{
                txtUsername: user.userName,
                txtPassword: user.password
            })
        }
    }

    logout() {
        return this.http.get(CONSTANST.routes.authorization.logout, { headers: this.headers });
    }

    hasToken():boolean {
        return !!localStorage.getItem('token');
    }
}
