import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';

import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { config } from '@fullcalendar/core';


const routes: Routes = [
  { path: 'admin', loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule' },
  { path: 'admin', loadChildren: './layouts/layout1/layout1.module#Layout1Module'},
  { path: '', loadChildren: './layouts/blank-layout/blank-layout.module#BlankLayoutModule'}
];

// const config1: ExtraOptions = {
//   useHash: false
// };

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
