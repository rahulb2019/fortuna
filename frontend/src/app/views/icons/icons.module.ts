import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SofboxModule} from '../../components/sofbox/sofbox.module';
import { IconsRoutingModule } from './icons-routing.module';
import { IconDripiconsComponent } from './icon-dripicons/icon-dripicons.component';
import { IconsFontawesomeComponent } from './icons-fontawesome/icons-fontawesome.component';
import { IconsLineawesomeComponent } from './icons-lineawesome/icons-lineawesome.component';
import { IconsRemixiconComponent } from './icons-remixicon/icons-remixicon.component';
import { IconsUniconsComponent } from './icons-unicons/icons-unicons.component';


@NgModule({
  declarations: [IconDripiconsComponent, IconsFontawesomeComponent, IconsLineawesomeComponent, IconsRemixiconComponent, IconsUniconsComponent],
  imports: [
    CommonModule,
    IconsRoutingModule,
    SofboxModule
  ],
  exports: [IconDripiconsComponent, IconsFontawesomeComponent, IconsLineawesomeComponent, IconsRemixiconComponent, IconsUniconsComponent]
})
export class IconsModule { }
