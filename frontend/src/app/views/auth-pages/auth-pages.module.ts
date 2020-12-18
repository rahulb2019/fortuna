import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthPagesRoutingModule } from './auth-pages-routing.module';
import { SignInComponent } from './default/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './default/forgot-password/forgot-password.component';
import { SignUpComponent } from './default/sign-up/sign-up.component';
import { LockScreenComponent } from './default/lock-screen/lock-screen.component';
import { PasswordResetComponent } from './default/password-reset/password-reset.component';
import { ConfirmMailComponent } from './default/confirm-mail/confirm-mail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    SignInComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    LockScreenComponent,
    PasswordResetComponent,
    ConfirmMailComponent
  ],
  imports: [
    CommonModule,
    AuthPagesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SignInComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    LockScreenComponent,
    PasswordResetComponent,
    ConfirmMailComponent
  ]
})
export class AuthPagesModule { }
