import { Component, OnInit, ChangeDetectorRef, NgZone, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AuthService } from '~services/auth.service';
import { ConfirmComponent } from '~components/confirm/confirm.component';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.css'],
    providers: [AuthService]
})

export class AdminLayoutComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    mobileQuery: MediaQueryList;
    private mobileQueryListener: () => void;

    @ViewChild('progressBar', { static: false })
    progressBar: ElementRef;

    constructor(
        private authService: AuthService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        public dialog: MatDialog,

        private router: Router,
        private ngZone: NgZone,
        private renderer: Renderer2
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);

        router.events.subscribe((event: RouterEvent) => {
            this._navigationInterceptor(event);
        });
    }

    ngOnInit() {
        this.isLoggedIn$ = this.authService.isLoggedIn;
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }

    /*ABRE EL COMPONENTE ConfirmComponent, LE INYECTA LOS DATOS A MOSTRAR Y SE SUSCRIBE PARA VER LA RESPUESTA BOOLEANA*/
    openDialog(): void {
        const dialogRef = this.dialog.open(ConfirmComponent, {
            width: '250px',
            data: {
                title: 'Logout',
                message: 'Close session?'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.authService.logout().subscribe((data: any) => {
                    if (data.success) {
                        this.authService.loggedIn.next(false);
                        localStorage.removeItem('token');
                        this.router.navigate(['/login']);
                    }
                });
            }
        });
    }

    // BARRA DE PROGRESO
    private _navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.ngZone.runOutsideAngular(() => {
                this.renderer.setStyle(this.progressBar.nativeElement, 'opacity', '1');
            });
        }
        if (event instanceof NavigationEnd) {
            setTimeout(() => {
                this.hideProgressBar();
            }, 1000);
        }
        if (event instanceof NavigationCancel) {
            setTimeout(() => {
                this.hideProgressBar();
            }, 1000);
        }
        if (event instanceof NavigationError) {
            setTimeout(() => {
                this.hideProgressBar();
            }, 1000);
        }
    }
    /* OCULTA LA BARRA DE PROGRESO CUANDO LA PAGINA
    DEJA DE CARGAR */
    private hideProgressBar(): void {
        this.ngZone.runOutsideAngular(() => {
            this.renderer.setStyle(this.progressBar.nativeElement, 'opacity', '0');
        });
    }
}