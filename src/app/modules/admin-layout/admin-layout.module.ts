import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';
import { DashboardModule } from '~modules/dashboard/dashboard.module';
import { ClientModule } from '~modules/client/client.module';
import { UserModule } from '~modules/user/user.module';

import { AdminLayoutComponent } from './admin-layout.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    DashboardModule,
    ClientModule,
    UserModule,
  ],
  declarations: [
    AdminLayoutComponent
  ],
  providers: [],
  exports: []
})
export class AdminLayoutModule {
}
