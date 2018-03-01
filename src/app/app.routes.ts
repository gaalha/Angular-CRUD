import { RouterModule, Routes } from '@angular/router';

import {
  AboutComponent,
  ContactUsComponent,
  HomeComponent,
  SupportComponent
} from "./components/index.pages";

const app_routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'support', component: SupportComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const app_routing = RouterModule.forRoot(app_routes, { useHash: true });

