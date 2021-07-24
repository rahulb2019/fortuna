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

import { ReportsRoutingModule } from './reports-routing.module';
import { CumulativeReportComponent } from './cumulative_report/cumulative_report.component';
import { SummaryReportComponent } from './summary_report/summary_report.component';
import { ExportAsModule } from 'ngx-export-as';
import { DatepickerRangeComponent } from './datepicker-range/datepicker-range.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    CumulativeReportComponent,
    SummaryReportComponent,
    DatepickerRangeComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
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
    NgbModule,
    ExportAsModule
  ],
  exports: [
  ]
})
export class ReportsModule {}
