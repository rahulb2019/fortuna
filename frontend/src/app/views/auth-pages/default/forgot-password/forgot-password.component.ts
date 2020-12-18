import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
//import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: []
})
export class ForgotPasswordComponent implements OnInit {

  @ViewChild("ref", { static: false }) ref;


  constructor(
    //private cookieService: CookieService,
    private fb: FormBuilder,
    //private toastr: ToastrService,
    private router: Router
  ) {
    
    
  }

  ngOnInit() {

  }

}
