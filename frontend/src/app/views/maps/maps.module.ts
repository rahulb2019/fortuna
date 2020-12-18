import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SofboxModule} from '../../components/sofbox/sofbox.module';
import { MapsRoutingModule } from './maps-routing.module';
import { PagesMapComponent } from './pages-map/pages-map.component';


@NgModule({
  declarations: [PagesMapComponent],
  imports: [
    CommonModule,
    MapsRoutingModule,
    SofboxModule
  ],
  exports: [PagesMapComponent]
})
export class MapsModule { }
