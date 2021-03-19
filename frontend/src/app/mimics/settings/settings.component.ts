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
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: []
})
export class SettingsComponent implements OnInit {

  settingForm: FormGroup;
  isSubmitted: boolean;
  isValid: boolean = true;
  errorField: string;
  mimicId: any;
  selectedFre: Number = 30;
  frequencyArr:any = [
    {
      value: 5,
      name: "5 Seconds"
    },
    {
      value: 10,
      name: "10 Seconds"
    },
    {
      value: 30,
      name: "30 Seconds"
    },
    {
      value: 60,
      name: "1 minute"
    },
    {
      value: 180,
      name: "3 minutes"
    },
    {
      value: 300,
      name: "5 minutes"
    },
    {
      value: 600,
      name: "10 minutes"
    },
    {
      value: 900,
      name: "15 minutes"
    },
    {
      value: 1800,
      name: "30 minutes"
    }
  ]

  constructor(
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private mimicService: MimicService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) {
    this.activatedRoute.params.subscribe(params => {
      this.mimicId = params.id;
      this.getMimicDataById();
    });
    this.createSettingForm();    
  }

  ngOnInit() {
    this.selectedFre = 30;
  }
  
  getMimicDataById(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getMimicDetail(dataObj).subscribe(res => {  
      if (res.code === 200) {
        this.settingForm.patchValue(res.result[0].mimic_settings);  
      }
      else {        
        this.toastr.error(res.message); //alert error message
      }
    });
  }

  createSettingForm(){
    this.settingForm = this.fb.group({
      schedule: [false, [Validators.required]],
      unbalancing: [false, [Validators.required]],
      high_voltage: [false, [Validators.required]],
      low_voltage: [false, [Validators.required]],
      high_current: [false, [Validators.required]],
      low_current: [false, [Validators.required]],
      high_level: [false, [Validators.required]],
      low_level: [false, [Validators.required]],
      frequency_for_api: ["30", [Validators.required]]
    });
  }

  goBack(){
    this.router.navigate(["/admin/mimics/mimic_list"]);
  }

  changeSelectedFrequency(event){
    this.selectedFre = event.target.value ? event.target.value : this.selectedFre;
  }

  saveMimicSettings() {
    if (this.settingForm.invalid) {
      const invalid = [];
      const controls = this.settingForm.controls;
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
      this.settingForm.value.mimic_settings = this.settingForm.value;
      this.settingForm.value.id = this.mimicId;
      let dataObj = {
        mimic_settings: {
          schedule: this.settingForm.value.schedule,
          unbalancing: this.settingForm.value.unbalancing,
          high_voltage: this.settingForm.value.high_voltage,
          low_voltage: this.settingForm.value.low_voltage,
          high_current: this.settingForm.value.high_current,
          low_current: this.settingForm.value.low_current,
          high_level: this.settingForm.value.high_level,
          low_level: this.settingForm.value.low_level,
          frequency_for_api: this.settingForm.value.frequency_for_api
        },
        _id: this.mimicId
      }
      this.mimicService.saveMimicSettings(dataObj).subscribe(res => {
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
