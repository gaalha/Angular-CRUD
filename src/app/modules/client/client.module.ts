import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';

import { ClientComponent } from './client.component';
import { FormsComponent } from './forms/forms.component';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: ClientComponent}]),
    SharedModule
  ],
  declarations: [
    ClientComponent,
    FormsComponent
  ],
  providers: [],
  entryComponents: [
    FormsComponent
  ],
  exports: [
    RouterModule,
  ]
})
export class ClientModule { }

