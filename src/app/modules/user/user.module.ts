import { NgModule } from '@angular/core';
import { SharedModule } from '~utils/shared.module';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
// import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
  declarations: [], // UserFormComponent
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: UserComponent}]),
  ]
})
export class UserModule { }
