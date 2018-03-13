import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import { LoginComponent } from './components/login/login.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

// DIALOGS
/*import { ConfirmComponent } from './components/dialogs/logout/logout.component';
import { SnackbarComponent } from './components/dialogs/error/error.component';*/

// SERVICES
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { PersonService } from './services/person.service';

// MODULES
import { UserComponent } from './modules/user/user.component';
import { PersonComponent } from './modules/person/person.component';

import { LayoutModule } from './modules/layouts/layout.module';

@NgModule( {
    declarations: [
        AppComponent,
        SidebarComponent,
        HomeComponent,
        AboutComponent,
        ContactUsComponent,
        LoginComponent,
        NotFoundComponent,
        SidenavComponent,
        UserComponent,
        PersonComponent
    ],
    imports: [
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        LayoutModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        UserService,
        PersonService
    ],
    entryComponents: [
        /*ConfirmComponent,
        SnackbarComponent*/
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
