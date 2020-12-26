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

import { MimicImagesRoutingModule } from './mimic_images-routing.module';
import { ViewGalleryComponent } from './view_gallery/view_gallery.component';
import { UploadImageComponent } from './upload_image/upload_image.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    ViewGalleryComponent,
    UploadImageComponent
  ],
  imports: [
    CommonModule,
    MimicImagesRoutingModule,
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
export class MimicImagesModule { }
