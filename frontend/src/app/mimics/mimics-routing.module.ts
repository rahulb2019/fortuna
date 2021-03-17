import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MimicComponent } from './mimic/mimic.component';

import { AddMimicComponent } from './add_mimic/add_mimic.component';
import { EditMimicComponent } from './edit_mimic/edit_mimic.component';
import { MimicListComponent } from './mimic_list/mimic_list.component';
import { StudioComponent } from './studio/studio.component';
import { PreviewComponent } from './preview/preview.component';
import { SettingsComponent } from './settings/settings.component';
import { RunComponent } from './run/run.component';
import { ScheduleComponent } from './schedule/schedule.component';


const routes: Routes = [
  {
    path: 'manage_mimic/:id',
    component: MimicComponent
  },
  {
    path: 'studio/:id',
    component: StudioComponent
  },
  {
    path: 'preview/:id',
    component: PreviewComponent
  },
  {
    path: 'mimic_list',
    component: MimicListComponent
  },
  {
    path: 'add_mimic',
    component: AddMimicComponent
  },
  {
    path: 'edit_mimic/:id',
    component: EditMimicComponent
  }, 
  {
    path: 'settings/:id',
    component: SettingsComponent
  }, 
  {
    path: 'run/:id',
    component: RunComponent
  },
  {
    path: 'schedule/:id',
    component: ScheduleComponent
  }, 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MimicsRoutingModule { }
