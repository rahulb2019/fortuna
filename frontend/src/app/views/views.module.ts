import { NgModule } from '@angular/core';
import {SofboxModule} from '../components/sofbox/sofbox.module';

import { CommonModule } from '@angular/common';
import { ViewsRoutingModule } from './views-routing.module';
import { Dashboard2Component } from './dashboards/dashboard2/dashboard2.component';

import {Dashboard1Component} from './dashboards/dashboard1/dashboard1.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { AnalyticsComponent } from './dashboards/analytics/analytics.component';
import {ProgressbarModule} from 'ngx-bootstrap';
import { WebAnalyticsComponent } from './dashboards/web-analytics/web-analytics.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import { TrackingComponent } from './dashboards/tracking/tracking.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TicketBookingComponent } from './dashboards/ticket-booking/ticket-booking.component';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {NgScrollbarModule} from 'ngx-scrollbar';
import { NgwWowModule } from 'ngx-wow';
import { CalendarComponent } from './calendar/calendar.component';
import { PatientComponent } from './dashboards/patient/patient.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    Dashboard1Component,
    Dashboard2Component,
    AnalyticsComponent,
    WebAnalyticsComponent,
    TrackingComponent,
    TicketBookingComponent,
    CalendarComponent,
    PatientComponent,
  ],
  imports: [
    CommonModule,
    ViewsRoutingModule,
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
export class ViewsModule { }
