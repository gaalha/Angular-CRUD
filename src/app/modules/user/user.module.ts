import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';
import { UserComponent } from './user.component';
import { UserFormComponent } from './components/user-form/user-form.component';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: UserComponent}]),
    SharedModule,
  ],
  declarations: [
    UserComponent,
    UserFormComponent,
  ],
  entryComponents: [
    UserFormComponent,
  ]
})
export class UserModule { }
