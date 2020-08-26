import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// FILTER
import { AuthGuard } from '~guards/auth.guard';

// LAYOUTS
import { AdminLayoutComponent } from '~modules/admin-layout/admin-layout.component';
import { LoginLayoutComponent } from '~modules/login-layout/login-layout.component';

/*CON LA CREACIÓN DEL ARCHIVO INDEX.PAGES NOS AHORRAMOS TENER QUE HACER
UNA IMPORTACIÓN POR CADA COMPONENTE DE LAS VISTAS*/
import {
  NotFoundComponent,
} from '~utils/index.pages';

// ROUTES
const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: '~modules/dashboard/dashboard.module#DashboardModule',
      },
      {
        path: 'clients',
        loadChildren: '~modules/client/client.module#ClientModule',
      },
      {
        path: 'users',
        loadChildren: '~modules/user/user.module#UserModule',
      },
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: '~modules/login-layout/login/login.module#LoginModule',
      },
      { path: '404', component: NotFoundComponent },
      { path: '**', redirectTo: '/404' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

