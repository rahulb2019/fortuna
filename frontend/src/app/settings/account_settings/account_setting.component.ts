import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { AdminService } from "../../services/admin/admin.service";
import { Folder } from "../../config/constants";
import { environment } from "../../../environments/environment";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: 'app-account-setting',
  templateUrl: './account_setting.component.html',
  styleUrls: []
})
export class AccountSettingComponent implements OnInit {
  accountSettingForm: FormGroup;

  isSubmitted: boolean;
  isValid: boolean = true;
  isRequiredName: boolean;
  isRequiredEmail: boolean;
  errorField: string;
  userDetails: any;

  breadCrumbItems = [
    {
      isActive: true,
      label: 'Account Settings'
    }
  ];

  constructor(
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private settingService: AdminService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) {
    
    this.createAccountSettingformFnc();
  }

  ngOnInit() { 
  }

  createAccountSettingformFnc(){
    this.userDetails = JSON.parse(sessionStorage.admin_login).admindata; // fetching sessionStorage data of company_admin
    this.accountSettingForm = this.fb.group({
      first_name: [this.userDetails.first_name, [Validators.maxLength(25)]],
      last_name: [this.userDetails.last_name, [Validators.maxLength(25)]],
      email: [this.userDetails.email, [Validators.required, Validators.email]],
      phone: [this.userDetails.phone, Validators.minLength(10)],
      new_password: [""],
      confirm_password: [""],
    });
  }

  accountSetting() {
    if (this.accountSettingForm.invalid) {
      const invalid = [];
      const controls = this.accountSettingForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      this.errorField = 'error-field';
      this.isSubmitted = true;
    } else {
      if(this.accountSettingForm.value.new_password !== this.accountSettingForm.value.confirm_password){
        return;
      }else {
        this.errorField = "";
        let formData = this.accountSettingForm.value;
        this.accountSettingForm.value.id = this.userDetails._id
        this.settingService.accountSetting(this.accountSettingForm.value).subscribe(res => {
          if (res.code == 200) {
                this.toastr.success(res.message);
                this.settingService.setSession(res.result);
                // this.settingService.setUserData(res.data); // restore Session data
                this.router.navigate(["/admin/dashboard/"]); // refresh account setting form
          } else {
            this.toastr.error(res.message);
          }
        });
      }
    }
  }
}
