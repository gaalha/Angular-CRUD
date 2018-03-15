import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../utils/shared.module';
import { AdminLayoutComponent } from './admin-layout.component';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        AdminLayoutComponent
    ],
    providers: [],
    exports: []
})
export class AdminLayoutModule {
}