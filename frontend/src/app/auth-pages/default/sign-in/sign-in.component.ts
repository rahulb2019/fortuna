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
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styles: []
})
export class SignInComponent implements OnInit {

  @ViewChild("ref", { static: false }) ref;
  
  loginForm: FormGroup;

  isSubmitted: boolean;
  rememberMe: boolean;
  checked: boolean;
  errorField: string;

  constructor(
    private adminService: AdminService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    const remeberMe = this.cookieService.get("remeberme");
    if (remeberMe && remeberMe == "true") {
      const email = this.cookieService.get("email");
      const password = this.cookieService.get("password");
      this.loginForm = this.fb.group({
        // Login form with setting cookie value
        email: [email, [Validators.required, Validators.email]],
        password: [password, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
        rememberMe: [true, []]
      });
    } else {
      this.loginForm = this.fb.group({
        // Login form
        email: ["", [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
        rememberMe: [null, []]
      });
    }
  }

  ngOnInit() {
    if (this.adminService.isAuth()) {
      // checking Auth
      const isData = JSON.parse(sessionStorage.admin_login).admindata;
      if (isData) {
        this.router.navigate(["/admin/dashboard"]);
      } else {
        this.router.navigate(["/admin"]);
      }
    } else {
      //console.log("no auth");
    }
  }



  login() {
    if (this.loginForm.invalid) {
      const invalid = [];
      const controls = this.loginForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      this.errorField = 'error-field';
      this.isSubmitted = true;
      return;
    } else {
      this.errorField = "";
      this.adminService.loginAdmin(this.loginForm.value).subscribe(res => {
        if (res.code === 200) {
            const remeberMe = this.cookieService.get("remeberme");
            if (remeberMe) {
              this.cookieService.set("email", this.loginForm.value.email);
              this.cookieService.set("password", this.loginForm.value.password);
            } else {
              this.cookieService.delete("email");
              this.cookieService.delete("password");
            }
            this.adminService.setSession(res.result);
            this.toastr.success(res.message);
            this.router.navigate(["/admin/dashboard/"]);
        }
        else {
          this.toastr.error("Invalid credentials!"); //alert error message
        }
      });
    }
  }

  remember(event) {
    event.preventDefault();
    ///this.ref._checked = !this.ref._checked;
    //console.log(".....ref._checked....", this.ref._checked, event.target.checked);
    if (event.target.checked) {
      this.cookieService.set("remeberme", "true");
    } else {
      this.cookieService.set("remeberme", "false");
      this.cookieService.delete("remeberme");
    }
  }

}
