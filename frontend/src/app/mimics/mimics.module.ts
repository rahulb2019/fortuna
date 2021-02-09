import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SofboxModule } from '../components/sofbox/sofbox.module';

import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';
import { ProgressbarModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgwWowModule } from 'ngx-wow';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MimicsRoutingModule } from './mimics-routing.module';
import { MimicComponent } from './mimic/mimic.component';

import { AddMimicComponent } from './add_mimic/add_mimic.component';
import { EditMimicComponent } from './edit_mimic/edit_mimic.component';
import { MimicListComponent } from './mimic_list/mimic_list.component';
import { StudioComponent } from './studio/studio.component';
import { PreviewComponent } from './preview/preview.component';
import { SettingsComponent } from './settings/settings.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    MimicComponent,
    StudioComponent,
    PreviewComponent,
    AddMimicComponent,
    EditMimicComponent,
    MimicListComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    MimicsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SofboxModule,
    LottieModule.forRoot({player: playerFactory}),
    ProgressbarModule,
    CarouselModule,
    TabsModule,
    NgScrollbarModule,
    NgwWowModule,
    SlickCarouselModule,
    NgbModule
  ],
  exports: [
  ]
})
export class MimicsModule { }
