import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppMaterialModule } from './theme/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from "@angular/common/http";

// ROUTES
import { AppRoutingModule } from "./app.routes";

// LAYOUT
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';

// PLUGGINS
import './rxjs-operators';

// COMPONENTS
import { AppComponent } from './components/app/app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SupportComponent } from './components/support/support.component';
import { MenuComponent } from './components/menu/menu.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

// DIALOGS
import { LogoutComponent } from './auth/dialogs/logout/logout.component';
import { ErrorComponent } from './auth/dialogs/error/error.component';
import { DialogsComponent } from './components/dialogs/dialogs.component';

// SERVICES
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { UserService } from './services/user.service';
import { PersonService } from './services/person.service';

// MODULES
import { UserComponent } from './components/modules/user/user.component';
import { PersonComponent } from './components/modules/person/person.component';

@NgModule( {
    declarations: [
        AppComponent,
        SidebarComponent,
        HomeComponent,
        AboutComponent,
        ContactUsComponent,
        SupportComponent,
        MenuComponent,
        HomeLayoutComponent,
        LoginLayoutComponent,
        LoginComponent,
        NotFoundComponent,
        LogoutComponent,
        ErrorComponent,
        UserComponent,
        PersonComponent,
        DialogsComponent,
        SidenavComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        AppMaterialModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        UserService,
        PersonService
    ],
    entryComponents: [
        LogoutComponent,
        ErrorComponent,
        DialogsComponent
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
