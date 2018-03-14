import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../utils/shared.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        AdminLayoutComponent,
        ProgressBarComponent
    ],
    providers: [],
    exports: []
})
export class AdminLayoutModule {
}