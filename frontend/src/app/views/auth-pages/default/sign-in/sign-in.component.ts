import { Component, OnInit, ViewChild } from '@angular/core';
//import { CompanyAdminService } from "../../../../services/company_admin/company_admin.service";
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
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styles: []
})
export class SignInComponent implements OnInit {

  @ViewChild("ref", { static: false }) ref;
  
  loginForm: FormGroup;

  isSubmited: boolean;
  rememberMe: boolean;
  checked: boolean;
  errorField: string;

  constructor(
    //private companyAdminService: CompanyAdminService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    //private toastr: ToastrService,
    private router: Router
  ) {
    const remeberMe = this.cookieService.get("remeberme");
    if (remeberMe) {
      const email = this.cookieService.get("email");
      const password = this.cookieService.get("password");
      this.loginForm = this.fb.group({
        // Login form with setting cookie value
        email: [email, [Validators.required, Validators.email, Validators.maxLength(80)]
        ],
        password: [password, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]
        ],
        rememberMe: [true, []]
      });
    } else {
      this.loginForm = this.fb.group({
        // Login form
        email: ["", [Validators.required, Validators.email, Validators.maxLength(80)]
        ],
        password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]
        ],
        rememberMe: [null, []]
      });
    }
  }

  ngOnInit() {

  }



  // login() {
  //   if (this.loginForm.invalid) {
  //     const invalid = [];
  //     const controls = this.loginForm.controls;
  //     for (const name in controls) {
  //       if (controls[name].invalid) {
  //         invalid.push(name);
  //       }
  //     }
  //     this.errorField = "error-field";
  //     this.isSubmited = true;
  //     return;
  //   } else {
  //     this.errorField = "";
  //     this.companyAdminService.loginCompanyAdmin(this.loginForm.value).subscribe(res => {
  //       if (res.code === 200) {
  //           const remeberMe = this.cookieService.get("remeberme");
  //           if (remeberMe) {
  //             this.cookieService.set("email", this.loginForm.value.email);
  //             this.cookieService.set("password", this.loginForm.value.password);
  //           } else {
  //             this.cookieService.delete("email");
  //             this.cookieService.delete("password");
  //           }
  //           this.companyAdminService.setSession(res);
  //           this.router.navigate(["/dashboard/"]);
  //       }
  //       else {
  //         //this.toastr.error(res.msg); alert error message
  //       }
  //     });
  //   }
  // }

  // remember(event) {
  //   event.preventDefault();
  //   this.ref._checked = !this.ref._checked;
  //   if (this.ref._checked) {
  //     this.cookieService.set("remeberme", "true");
  //   } else {
  //     this.cookieService.delete("remeberme");
  //   }
  // }

}
