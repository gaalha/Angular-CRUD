import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// https://angular.io/tutorial/toh-pt5

// FILTER
import { AuthGuard } from '~guards/auth.guard';

// LAYOUTS
import { AdminLayoutComponent } from '~modules/admin-layout/admin-layout.component';
import { LoginLayoutComponent } from '~modules/login-layout/login-layout.component';

/*CON LA CREACIÓN DEL ARCHIVO INDEX.PAGES NOS AHORRAMOS TENER QUE HACER
UNA IMPORTACIÓN POR CADA COMPONENTE DE LAS VISTAS*/
import {
    ContactUsComponent,
    TablesComponent,
    LoginComponent,
    NotFoundComponent,
    PersonComponent,
    UserComponent,
    DashboardComponent
} from '~utils/index.pages';

// ROUTES
const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'person', component: PersonComponent },
            { path: 'contact-us', component: ContactUsComponent },
            { path: 'table', component: TablesComponent }
        ]
    },
    {
        path: '',
        component: LoginLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: '404', component: NotFoundComponent },
            { path: '**', redirectTo: '/404' }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

