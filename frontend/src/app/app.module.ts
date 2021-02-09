import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SofboxModule } from './components/sofbox/sofbox.module';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AlertModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgwWowModule } from 'ngx-wow';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { HttpIntercepterService } from './services/http-intercepter/http-intercepter.service';
import { HttpResponseIntercepterService } from './services/http-response-intercepter/http-response-intercepter.service';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SofboxModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    CarouselModule.forRoot(),
    ProgressbarModule.forRoot(),
    NgScrollbarModule,
    SlickCarouselModule,
    BrowserAnimationsModule,
    NgwWowModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({progressBar: true}),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD4nGs5ParwXfOv_IH1JEEuDMX-mkmdh0Q'
    })
  ],
  exports: [
    SofboxModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpIntercepterService,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpResponseIntercepterService, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
