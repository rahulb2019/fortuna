import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { UserService } from "../../services/user/user.service";
import { Folder } from "../../config/constants";
import { environment } from "../../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

import * as $ from 'jquery';

@Component({
  selector: 'app-add-user',
  templateUrl: './add_user.component.html',
  styleUrls: []
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;

  isSubmitted: boolean;
  isValid: boolean = true;
  isRequiredName: boolean;
  isRequiredEmail: boolean;
  errorField: string;
  userDetails: any;
  attendees: FormArray;
  user_logo: any;
  userLogoImg: any;
  uploadedUserLogo: any;
  defaultUserLogo: any = "default_user_logo.png";//assets/images/user/02.jpg

  imageError: any;
  userLogoData: any;
  accessType: any;
  
  // breadCrumbItems = [
  //   {
  //     isActive: false,
  //     label: 'Companies',
  //     link: '/companies/company_list/'
  //   },
  //   {
  //     isActive: true,
  //     label: 'Add New Company',
  //     link: ''
  //   }
  // ];

  constructor(
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) {
    
    //this.userDetails = JSON.parse(sessionStorage.admin_login).admindata;

    if (this.userLogoImg) {
      this.userLogoImg = environment.apiEndpoint + Folder._userImageOriginal + this.userLogoImg;
    } else {
      this.userLogoImg =  "assets/images/user/" + this.defaultUserLogo;
    }

    this.createuserFormFnc();    
  }

  ngOnInit() {
  }

  createuserFormFnc(){
    let URL_REGEXP = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      access_type: ['', [Validators.required]],
      image: ['']
    });
  }
  


  onSelectUserLogo(event){
    let acceptedTypes = ["image/jpg", "image/jpeg", "image/png"];
    this.imageError = null;
    this.userLogoData = null;
    let image: File = event.target.files[0];
    if (acceptedTypes.indexOf(image.type) < 0) {
      this.imageError = "Only jpg/png files are supported";
      return;
    }
    var imageReader: FileReader = new FileReader();
    imageReader.readAsDataURL(image);
    imageReader.onloadend = e => {
      this.userLogoData = {};
      this.userLogoData.image = imageReader.result;
      this.userLogoData.imageType = image.type;
      let _data = {
        inputImage: this.userLogoData,
        status: "user_image"
      };
      this.userService.uploadUserImage(_data).subscribe(res => {
        if (res.code == 200) {
          this.uploadedUserLogo = res.data;
          this.userLogoImg = environment.apiEndpoint + Folder._userImageOriginal + res.data;
          //this.toastr.success(res.message);
        } else {
          //this.toastr.error(res.message);
        }
      });
    };
  }

  changeAccess(accessVal){
    this.accessType = accessVal == 'read' ? 0 : 1;
  }

  addNewUser() {
    if (this.userForm.invalid) {
      const invalid = [];
      const controls = this.userForm.controls;
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
      if(this.uploadedUserLogo) {
        this.userForm.value.image = this.uploadedUserLogo;
      }
      this.userForm.value.access_type = this.accessType != undefined ? this.accessType : 0;
      //console.log(".....---....", this.userForm.value); return false;
      this.userService.addUser(this.userForm.value).subscribe(res => {
        if (res.code == 200) {
              this.toastr.success(res.message);
              this.router.navigate(["/admin/users/users_list"]);
        } else {
          this.toastr.error(res.message);
        }
      });
    }
  }
}
