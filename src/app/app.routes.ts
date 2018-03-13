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
} from './components/index.pages';

// LAYOUTS
import { HomeLayoutComponent } from './modules/layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './modules/layouts/login-layout/login-layout.component';


// ROUTES
const routes: Routes = [
    { path: '',
        component: HomeLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '',component: PersonComponent },
            { path: 'about', component: AboutComponent },
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

