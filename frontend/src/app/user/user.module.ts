import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';
import { SofboxModule } from '../components/sofbox/sofbox.module';

import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';
import { ProgressbarModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgwWowModule } from 'ngx-wow';


import { AddUserComponent } from './add_user/add_user.component';
import { EditUserComponent } from './edit_user/edit_user.component';
import { UserListComponent } from './user_list/user_list.component';
// import { AttendeeListComponent } from './attendee_list/attendee_list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { ConfirmDialogComponent } from '../services/confirm-dialog/confirm-dialog.component';
// import { ConfirmDialogService } from '../services/confirm-dialog/confirm-dialog.service';


export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AddUserComponent,
    UserListComponent,
    EditUserComponent,
    // AttendeeListComponent,
    // EditCompanyComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
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
  ],
  providers: [ ],
  entryComponents: [ ]
})
export class UserModule { }
