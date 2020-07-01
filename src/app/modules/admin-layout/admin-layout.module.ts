import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { DashboardModule } from '~modules/dashboard/dashboard.module';
import { PersonModule } from '~modules/person/person.module';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    DashboardModule,
    PersonModule,
  ],
  declarations: [
    AdminLayoutComponent
  ],
  providers: [],
  exports: []
})
export class AdminLayoutModule {
}
