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
  meter_data: FormArray;

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
        if(res.result[0] && res.result[0].meter_data && res.result[0].meter_data.length > 0){
          this.patchBlocks(res.result[0].meter_data);          
        }  
      }
      else {        
        this.toastr.error(res.message); //alert error message
      }
    });
  }

  patchBlocks(blocksData) {
    let meter_data = this.meterDataForm.get('meter_data') as FormArray;
    while (meter_data.length > 0) {
      meter_data.removeAt(0);
    }
    blocksData.forEach((element, index) => {
      if (index >= 0) {
        meter_data.push(
          this.createMeterBlock()
        );
      }
    });
    if (blocksData.length == meter_data.value.length) {
      this.meterDataForm.patchValue({
        meter_data: blocksData
      })
    }
  }

  createMeterDataForm(){
    this.meterDataForm = this.fb.group({
      meter_data: this.fb.array([this.createMeterBlock()]),
    });
  }

  /**Create Meter Block*/
  createMeterBlock() {
    return this.fb.group({
      name: [''],
      slave_id: [''],
      register_address: [''],
      data_type: [''],
      unit: [''],
      value: [''],
      division_factor: ['']
    });
  }

  /**Create Meter Block */
  addMeterBlock(item) {
    this.meter_data = this.meterDataForm.get('meter_data') as FormArray;
    this.meter_data.push(this.createMeterBlock());
  }
  /**Remove Meter Block */
  removeMeterBlock(index) {
    this.meter_data = this.meterDataForm.get('meter_data') as FormArray;
    this.meter_data.removeAt(index);
  }

  goBack(){
    this.router.navigate(["/admin/mimics/mimic_list"]);
  }

  saveMeterDetails() {
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
      this.meterDataForm.value.siteId = this.mimicId;this.mimicService.addDataMeterBlock(this.meterDataForm.value).subscribe(res => {
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
