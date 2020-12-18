import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthLayoutRoutingModule } from './auth-layout-routing.module';
import { IndexComponent } from './index/index.component';
import {SofboxModule} from '../../components/sofbox/sofbox.module';
import {CarouselModule} from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule,
    SofboxModule,
    CarouselModule
  ],
  exports: [IndexComponent]
})
export class AuthLayoutModule { }
