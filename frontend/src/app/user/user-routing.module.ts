import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUserComponent } from './add_user/add_user.component';
import { EditUserComponent } from './edit_user/edit_user.component';
// import { EditCompanyComponent } from './edit_company/edit_company.component';
import { UserListComponent } from './user_list/user_list.component';
// import { AttendeeListComponent } from './attendee_list/attendee_list.component';



const routes: Routes = [
  {
    path: 'users_list',
    component: UserListComponent
  },
  {
    path: 'add',
    component: AddUserComponent
  },
  {
    path: 'edit_user/:id',
    component: EditUserComponent
  },
  // {
  //   path: 'edit/:companyId/:event_type',
  //   component: EditCompanyComponent
  // } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
