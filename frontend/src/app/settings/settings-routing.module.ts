import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountSettingComponent } from './account_settings/account_setting.component';
// import { UpdateEmailTemplateComponent } from './update_email_templates/update_email_templates.component';


const routes: Routes = [
  {
    path: 'account_setting',
    component: AccountSettingComponent
  },
  // {
  //   path: 'edit/:templateId',
  //   component: UpdateEmailTemplateComponent
  // },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
