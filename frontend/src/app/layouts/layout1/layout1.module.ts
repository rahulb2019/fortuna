import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Layout1RoutingModule } from './layout1-routing.module';
import { IndexComponent } from './index/index.component';
import {SofboxModule} from '../../components/sofbox/sofbox.module';
// import { ConfirmDialogComponent } from '../../services/confirm-dialog/confirm-dialog.component';
// import { ConfirmDialogService } from '../../services/confirm-dialog/confirm-dialog.service';

@NgModule({
  declarations: [ IndexComponent ],
  imports: [
    CommonModule,
    Layout1RoutingModule,
    SofboxModule
  ],
  exports: [  ],
  providers: [ ],
  entryComponents: []
})
export class Layout1Module { }
