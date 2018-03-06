import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppMaterialModule } from './theme/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from "@angular/common/http";

// ROUTES
import { app_routing } from "./app.routes";

// LAYOUT
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';

// PLUGGINS
import './rxjs-operators';

// COMPONENTS
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SupportComponent } from './components/support/support.component';
import { MenuComponent } from './components/menu/menu.component';
import { PersonComponent } from './components/person/person.component';

// SERVICES
import { PersonService } from './services/person.service';

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
        PersonComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        AppMaterialModule,
        app_routing,
        HttpClientModule
    ],
    providers: [
        PersonService
    ],
    bootstrap: [ AppComponent ]
} )

export class AppModule { }
