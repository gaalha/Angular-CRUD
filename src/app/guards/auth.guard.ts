import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { take } from 'rxjs/operator/take';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> { /*next: ActivatedRouteSnapshot, state: RouterStateSnapshot*/
        return this.authService.isLoggedIn
        .take(1)
        .map((isLoggedIn: boolean) => !!isLoggedIn)
        .do(authenticated => {
            if (!authenticated) return false;
            return true;
        });
    }
}