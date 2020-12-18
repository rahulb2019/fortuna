import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from "../../../services/admin/admin.service";
import { Router } from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: []
})
export class ForgotPasswordComponent implements OnInit {

  @ViewChild("ref", { static: false }) ref;
  
  forgotPasswordForm: FormGroup;

  isSubmitted: boolean;
  //rememberMe: boolean;
  //checked: boolean;
  errorField: string;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    
  this.forgotPasswordForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]]
  });
    
  }

  ngOnInit() {

  }

  forgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      const invalid = [];
      const controls = this.forgotPasswordForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      this.errorField = "error-field";
      this.isSubmitted = true;
      return;
    } else {
      this.errorField = "";
      this.adminService.resetPasswordAdminFnc(this.forgotPasswordForm.value).subscribe(res => {
        if (res.code === 200) {
            this.toastr.success(res.message);
            this.router.navigate(["/admin"]);
        }
        else {
          this.toastr.error(res.message); //alert error message
        }
      });
    }
  }
}
