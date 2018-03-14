
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../utils/shared.module';
import { LoginLayoutComponent } from './login-layout.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule
  ],
  declarations: [
    LoginLayoutComponent
  ],
  providers: [],
  exports: []
})
export class LoginLayoutModule {
}