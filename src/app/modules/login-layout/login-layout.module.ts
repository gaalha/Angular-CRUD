import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../../utils/shared.module';
import { LoginLayoutComponent } from './login-layout.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        LoginLayoutComponent,
        LoginComponent
    ],
    providers: [],
    exports: []
})
export class LoginLayoutModule {
}