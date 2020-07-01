import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '~utils/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: DashboardComponent}]),
  ],
  exports: [
    RouterModule,
  ]
})
export class DashboardModule {
}
