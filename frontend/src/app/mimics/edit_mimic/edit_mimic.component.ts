import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { MimicService } from "../../services/mimic/mimic.service";
import { Folder } from "../../config/constants";
import { environment } from "../../../environments/environment";
import { ToastrService } from "ngx-toastr";

import * as $ from 'jquery';

@Component({
  selector: 'app-edit-mimic',
  templateUrl: './edit_mimic.component.html',
  styleUrls: []
})
export class EditMimicComponent implements OnInit {

  mimicForm: FormGroup;

  isSubmitted: boolean;
  isValid: boolean = true;
  isRequiredName: boolean;
  isRequiredEmail: boolean;
  errorField: string;
  userDetails: any;
  mimicType: any;
  mimicId: any;

  constructor(
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private mimicService: MimicService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) {
      this.createMimicFormFnc();    
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.mimicId = params.id;
      this.getMimicDataById();
    });
  }

  createMimicFormFnc(){
    this.mimicForm = this.fb.group({
      name: ['', [Validators.required]],
      mimic_type: ['0', [Validators.required]],
      lattitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      no_of_pumps: ['', [Validators.required]]
    });
  }

  
  getMimicDataById(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getMimicDetail(dataObj).subscribe(res => {  
      if (res.code === 200) {
        this.mimicForm.patchValue(res.result[0]);  
      }
      else {        
        this.toastr.error(res.message); //alert error message
      }
    });
  }

  goBack(){
    this.router.navigate(["/admin/mimics/mimic_list"]);
  }

  changeMimicType(mimicVal){
    this.mimicType = mimicVal == 'zps' ? 0 : 1;
  }

  updateMimic(){
    if (this.mimicForm.invalid) {
      const invalid = [];
      const controls = this.mimicForm.controls;
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
      this.mimicForm.value.id = this.mimicId;
      this.mimicForm.value.mimic_type = this.mimicType != undefined ? this.mimicType : 0;
      this.mimicService.updateMimic(this.mimicForm.value).subscribe(res => {
        if (res.code == 200) {
              this.toastr.success(res.message);
              this.router.navigate(["/admin/mimics/mimic_list"]);
        } else {
          this.toastr.error(res.message);
        }
      });
    }
  }
}
