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
import { MimicService } from "../../services/mimic/mimic.service";
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import * as $ from 'jquery';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit_user.component.html',
  styleUrls: []
})
export class EditUserComponent implements OnInit {
  dropdownSettings:IDropdownSettings;

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
  ownerId: any;
  dropdownList = [];
  selectedSites = [];
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
    private toastr: ToastrService,
    private mimicService: MimicService) {
    
    //this.userDetails = JSON.parse(sessionStorage.admin_login).admindata;

    if (this.userLogoImg) {
      this.userLogoImg = environment.apiEndpoint + Folder._userImageOriginal + this.userLogoImg;
    } else {
      this.userLogoImg =  "assets/images/user/" + this.defaultUserLogo;
    }

    this.createuserFormFnc();    
  }

  ngOnInit() {
    this.fetchMimics();
    this.activatedRoute.params.subscribe(params => {
      this.ownerId = params.id;
      this.getUserDataById();
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 200
    };
  }

  fetchMimics() {
    let dataObj = {}
    this.mimicService.fetchMimicsForSel(dataObj).subscribe(res => {
      if (res.code === 200) {
        this.dropdownList = res.result;
      }
      else {
        this.toastr.error(res.message);
      }
    });
  }

  createuserFormFnc(){
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: [''],
      city: [''],
      zipcode: [''],
      selectedSites: ['', [Validators.required]]
    });
  }

  
  getUserDataById(){
    let dataObj = {
      ownerId: this.ownerId
    }
    this.userService.getUserDetail(dataObj).subscribe(res => {  
      if (res.code === 200) { 
        if (res.result[0].image && res.result[0].image != "default_user_logo.png") {
          this.userLogoImg = environment.apiEndpoint + Folder._userImageOriginal + res.result[0].image;
        } else {
          this.userLogoImg =  "assets/images/user/" + this.defaultUserLogo;
        }
        this.userForm.patchValue(res.result[0]);  
      }
      else {        
        this.toastr.error(res.message); //alert error message
      }
    });
  }
  


  // onSelectUserLogo(event){
  //   let acceptedTypes = ["image/jpg", "image/jpeg", "image/png"];
  //   this.imageError = null;
  //   this.userLogoData = null;
  //   let image: File = event.target.files[0];
  //   if (acceptedTypes.indexOf(image.type) < 0) {
  //     this.imageError = "Only jpg/png files are supported";
  //     return;
  //   }
  //   var imageReader: FileReader = new FileReader();
  //   imageReader.readAsDataURL(image);
  //   imageReader.onloadend = e => {
  //     this.userLogoData = {};
  //     this.userLogoData.image = imageReader.result;
  //     this.userLogoData.imageType = image.type;
  //     let _data = {
  //       inputImage: this.userLogoData,
  //       status: "user_image"
  //     };
  //     this.userService.uploadUserImage(_data).subscribe(res => {
  //       if (res.code == 200) {
  //         this.uploadedUserLogo = res.data;
  //         this.userLogoImg = environment.apiEndpoint + Folder._userImageOriginal + res.data;
  //         //this.toastr.success(res.message);
  //       } else {
  //         //this.toastr.error(res.message);
  //       }
  //     });
  //   };
  // }

  updateUser(){
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
      this.userForm.value.id = this.ownerId;
      this.userService.updateUser(this.userForm.value).subscribe(res => {
        if (res.code == 200) {
              this.toastr.success(res.message);
              this.router.navigate(["/admin/users/users_list"]);
        } else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  onItemSelect(item: any) {
    
  }
  onSelectAll(items: any) {
    
  }
}
