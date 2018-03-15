import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../utils/shared.module';

import { PersonComponent } from './person.component';
import { FormsComponent } from './forms/forms.component';

@NgModule({
    imports: [
        RouterModule,
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
    exports: []
})
export class PersonModule {
}