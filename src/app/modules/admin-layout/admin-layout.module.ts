import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../utils/shared.module';

import { AdminLayoutComponent } from './admin-layout.component';
/*import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';*/

@NgModule({
  imports: [
    RouterModule,
    SharedModule
  ],
  declarations: [
    AdminLayoutComponent/*,
    ProfileMenuComponent,
    SidenavListComponent*/
  ],
  providers: [],
  exports: []
})
export class AdminLayoutModule {
}