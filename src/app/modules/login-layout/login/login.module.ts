import { NgModule } from '@angular/core';
import { SharedModule } from '~utils/shared.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: LoginComponent}]),
  ]
})
export class LoginModule { }
