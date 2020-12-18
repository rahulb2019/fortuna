import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingRoutingModule } from './settings-routing.module';
import { SofboxModule } from '../components/sofbox/sofbox.module';

import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';
import { ProgressbarModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgwWowModule } from 'ngx-wow';
//import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';

 import { AccountSettingComponent  } from './account_settings/account_setting.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AccountSettingComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SofboxModule,
    LottieModule.forRoot({player: playerFactory}),
    ProgressbarModule,
    CarouselModule,
    TabsModule,
    NgScrollbarModule,
    NgwWowModule,
    SlickCarouselModule
  ]
})
export class SettingModule { }
