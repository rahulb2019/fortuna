import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { MimicService } from "../../services/mimic/mimic.service";
import { ToastrService } from "ngx-toastr";

import * as $ from 'jquery';

@Component({
  selector: 'app-add-meter-data',
  templateUrl: './add_meter_data.component.html',
  styleUrls: []
})
export class AddMeterDataComponent implements OnInit {

  meterDataForm: FormGroup;

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
      this.createMeterDataForm();   
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.mimicId = params.id;
      this.getMimicDataById();
    });
  }
  
  getMimicDataById(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getMimicDetail(dataObj).subscribe(res => {  
      if (res.code === 200) {
        //this.meterDataForm.patchValue(res.result[0]);  
      }
      else {        
        this.toastr.error(res.message); //alert error message
      }
    });
  }

  createMeterDataForm(){
    this.meterDataForm = this.fb.group({
      voltry_register: ['', [Validators.required]],
      voltyb_register: ['', [Validators.required]],
      voltbr_register: ['', [Validators.required]],
      currentr_register: ['', [Validators.required]],
      currenty_register: ['', [Validators.required]],
      currentb_register: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      pow_fact: ['', [Validators.required]],
      killowatt: ['', [Validators.required]],
    });
  }

  goBack(){
    this.router.navigate(["/admin/mimics/mimic_list"]);
  }

  addNewMimic() {
    if (this.meterDataForm.invalid) {
      const invalid = [];
      const controls = this.meterDataForm.controls;
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
      this.meterDataForm.value.siteId = this.mimicId;
      console.log(".....---....", this.meterDataForm.value); return false;
      // this.mimicService.addMeterData(this.meterDataForm.value).subscribe(res => {
      //   if (res.code == 200) {
      //         this.toastr.success(res.message);
      //         this.router.navigate(["/admin/mimics/mimic_list"]);
      //   } else {
      //     this.toastr.error(res.message);
      //   }
      // });
    }
  }
}
