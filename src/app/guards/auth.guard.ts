
import { Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router'; // ActivatedRouteSnapshot, RouterStateSnapshot
import { AuthService } from '~services/auth.service';

import { Observable } from 'rxjs';
import { tap, take, map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> { /* next: ActivatedRouteSnapshot, state: RouterStateSnapshot */
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

/*ESTE ARCHIVO ES UTILIZADO POR EL MODULO DE ROUTES PARA VERIFICAR SI EXISTE UNA SESIÓN
INICIADA O NO, EL METODO canActivate() INVOCA A UN METODO BOOLEANO EN EL AuthService QUE
SE SETEA COMO 'TRUE' AL INICIAR SESIÓN CORRECTAMENTE Y COMO 'FALSE' AL CERRAR SESIÓN.*/
