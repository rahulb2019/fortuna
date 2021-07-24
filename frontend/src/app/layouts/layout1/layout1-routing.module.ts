import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IndexComponent} from './index/index.component';

import { AuthGuardService } from '../../services/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      // {
      //   path: '',
      //   loadChildren: () => import('../../views/views.module').then(m => m.ViewsModule)
      // },
      // {
      //   path: 'email',
      //   loadChildren: () => import('../../views/application/email/email.module').then(m => m.EmailModule)
      // }
      {
        path: 'dashboard',
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
        // canActivate: [ AuthGuardService ]
      },
      {
        path: 'users',
        loadChildren: () => import('../../user/user.module').then(m => m.UserModule),
        // canActivate: [ AuthGuardService ]
      },
      {
        path: 'settings',
        loadChildren: () => import('../../settings/settings.module').then(m => m.SettingModule),
        // canActivate: [ AuthGuardService ]
      },
      {
        path: 'mimics',
        loadChildren: () => import('../../mimics/mimics.module').then(m => m.MimicsModule),
        // canActivate: [ AuthGuardService ]
      },
      {
        path: 'mimic_images',
        loadChildren: () => import('../../mimic_images/mimic_images.module').then(m => m.MimicImagesModule),
        // canActivate: [ AuthGuardService ]
      },
      {
        path: 'reports',
        loadChildren: () => import('../../reports/reports.module').then(m => m.ReportsModule),
        // canActivate: [ AuthGuardService ]
      }
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Layout1RoutingModule { }
