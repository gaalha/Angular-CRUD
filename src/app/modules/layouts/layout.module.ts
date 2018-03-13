import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../utils/shared.module';

//COMPONENTS
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        HomeLayoutComponent,
        LoginLayoutComponent
    ],
    exports: [
        HomeLayoutComponent,
        LoginLayoutComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LayoutModule { }