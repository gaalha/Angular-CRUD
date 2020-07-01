import { NgModule } from '@angular/core';
import { SharedModule } from '~utils/shared.module';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: UserComponent}]),
  ]
})
export class UserModule { }
