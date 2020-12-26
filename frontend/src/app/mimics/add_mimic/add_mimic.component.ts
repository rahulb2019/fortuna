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
  selector: 'app-add-mimic',
  templateUrl: './add_mimic.component.html',
  styleUrls: []
})
export class AddMimicComponent implements OnInit {

  mimicForm: FormGroup;

  isSubmitted: boolean;
  isValid: boolean = true;
  isRequiredName: boolean;
  isRequiredEmail: boolean;
  errorField: string;
  userDetails: any;
  mimicType: any;

  constructor(
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private mimicService: MimicService,
    private toastr: ToastrService) {
    this.createMimicFormFnc();    
  }

  ngOnInit() {
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

  goBack(){
    this.router.navigate(["/admin/mimics/mimic_list"]);
  }

  changeMimicType(mimicVal){
    this.mimicType = mimicVal == 'zps' ? 0 : 1;
  }

  addNewMimic() {
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
      this.mimicForm.value.mimic_type = this.mimicType != undefined ? this.mimicType : 0;
      //console.log(".....---....", this.mimicForm.value); return false;
      this.mimicService.addMimic(this.mimicForm.value).subscribe(res => {
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
