import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';

import { PersonComponent } from './person.component';
import { FormsComponent } from './forms/forms.component';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: PersonComponent}]),
    SharedModule
  ],
  declarations: [
    PersonComponent,
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
export class PersonModule {
}
