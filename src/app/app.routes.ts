import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// FILTER
import { AuthGuard } from './auth/auth.guard';

//COMPONENTS
import {
    AboutComponent,
    ContactUsComponent,
    HomeComponent,
    SupportComponent,
    LoginComponent,
    NotFoundComponent
} from './components/index.pages';

// LAYOUTS
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';


// ROUTES
const routes: Routes = [
    { path: '',
        component: HomeLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '',component: HomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'support', component: SupportComponent },
            { path: 'contact-us', component: ContactUsComponent }
        ]
    },
    { path: '',
        component: LoginLayoutComponent,
        children: [
            {path: 'login',component: LoginComponent},
            {path: '404', component: NotFoundComponent},
            {path: '**', redirectTo: '/404'}
        ]
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash:true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

