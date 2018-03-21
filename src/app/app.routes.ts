import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// FILTER
import { AuthGuard } from './guards/auth.guard';

//COMPONENTS
import {
    AboutComponent,
    ContactUsComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    PersonComponent,
    UserComponent
} from './utils/index.pages';

// LAYOUTS
import { AdminLayoutComponent } from './modules/admin-layout/admin-layout.component';
import { LoginLayoutComponent } from './modules/login-layout/login-layout.component';

// ROUTES
const routes: Routes = [
    { path: '',
        component: AdminLayoutComponent,
        canActivate: [ AuthGuard ],
        children: [
            { path: '',component: PersonComponent },
            { path: 'about', component: AboutComponent },
            { path: 'contact-us', component: ContactUsComponent },
            { path: 'table', component: HomeComponent }
        ]
    },
    { path: '',
        component: LoginLayoutComponent,
        children: [
            { path: 'login',component: LoginComponent },
            { path: '404', component: NotFoundComponent },
            { path: '**', redirectTo: '/404' }
        ]
    }

];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }

