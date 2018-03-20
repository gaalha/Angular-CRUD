import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { take } from 'rxjs/operator/take';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    /*canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.isLoggedIn
        .take(1)
        .map((isLoggedIn: boolean) => {
            if (!isLoggedIn){
                this.router.navigate(['login']);
                return false;
            }else{
                return true;
            }
        });
    }*/

    canActivate(): Observable<boolean> {
        return this.authService.isLoggedIn
        .take(1)
        .map((isLoggedIn: boolean) => !!isLoggedIn)
        .do(authenticated => {
            if (!authenticated) return false;
            return true;
        });
    }
}