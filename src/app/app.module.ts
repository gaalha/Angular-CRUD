import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule} from "@angular/common/http";
import { SharedModule } from './utils/shared.module';

// ROUTES
import { AppRoutingModule } from "./app.routes";

// GUARDS
import { AuthGuard } from './guards/auth.guard';

// PLUGGINS
import './rxjs-operators';

// COMPONENTS
import { AppComponent } from './components/app/app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

// SERVICES
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { PersonService } from './services/person.service';

// MODULES
import { UserComponent } from './modules/user/user.component';
import { AdminLayoutModule } from './modules/admin-layout/admin-layout.module';
import { LoginLayoutModule } from './modules/login-layout/login-layout.module';
import { PersonModule } from './modules/person/person.module';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

@NgModule( {
    declarations: [
        AppComponent,
        SidebarComponent,
        HomeComponent,
        AboutComponent,
        ContactUsComponent,
        NotFoundComponent,
        UserComponent,
        ConfirmComponent,
        SnackbarComponent,
        DashboardComponent
    ],
    imports: [
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        AdminLayoutModule,
        LoginLayoutModule,
        PersonModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        UserService,
        PersonService
    ],
    entryComponents: [
        ConfirmComponent,
        SnackbarComponent
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
