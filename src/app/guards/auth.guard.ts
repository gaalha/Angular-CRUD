
import { Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router';
import { AuthService } from '~services/auth.service';
import { Observable } from 'rxjs';
import { tap, take, map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => !!isLoggedIn),
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
