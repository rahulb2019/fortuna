import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { MimicService } from "../../services/mimic/mimic.service";
import { ToastrService } from "ngx-toastr";
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

import * as $ from 'jquery';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: []
})
export class ControlComponent implements OnInit {

  controlForm: FormGroup;
  modalForm: FormGroup;

  controls: FormArray;
  control_blocks: FormArray;
  modalRef: BsModalRef;
  
  isSubmitted: boolean;
  isValid: boolean = true;
  errorField: string;
  mimicId: any;
  totalPumpsAdded: any;
  selectedInput: any;

  

  constructor(
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private mimicService: MimicService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService, private modalService: BsModalService) {
    this.activatedRoute.params.subscribe(params => {
      this.mimicId = params.id;
      this.getMimicDataById(); 
    });    
    this.createControlForm();
    this.createModalFormFnc();
  }

  ngOnInit() {   
  }

  goBack(){
    this.router.navigate(["/admin/mimics/mimic_list"]);
  }
  
  getMimicDataById(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getMimicDetail(dataObj).subscribe(res => {  
      if (res.code === 200) {
        this.totalPumpsAdded = res.result[0].mimic_data.filter(val => {
          return val.category === "Pumps";
        })
        this.getMimicControlData();
      }
      else {        
        this.toastr.error(res.message); //alert error message
      }
    });
  }

  getMimicControlData(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getControlData(dataObj).subscribe(res => {
      if (res.code === 200) {
        let controlsData = [];
        let controlDataResponse = res.result.length > 0 ? res.result[0] : [];
        controlDataResponse && controlDataResponse.forEach(element => {
          controlsData.push(element);
        });
        // console.log('controlsData',controlsData);
        // console.log('controlDataResponse',controlDataResponse);
        if(controlsData && controlsData.length > 0){
          this.controlForm.patchValue(controlDataResponse);
          this.patchControls(controlsData);
        }
      }
    });
  }

  createControlForm(){
    this.controlForm = this.fb.group({    
      controls: this.fb.array([this.createControlBlock()]),
    });
  }

  /**Create Control Block*/
  createControlBlock() {
    return this.fb.group({
      pumpValue: [''],
      control_blocks: this.fb.array([this.createControlLine()])
    });
  }

  /**Create Pump Key-Value control line*/
  createControlLine() {
    return this.fb.group({
      name: ['', [Validators.required]],
      value: ['', [Validators.required]],
      slaveId: ['', [Validators.required]],
      register: ['', [Validators.required]],
    });
  }


  /**Create Pump Line Control Time Row */
  addControl(item) {
    this.control_blocks = item.get('control_blocks') as FormArray;
    this.control_blocks.push(this.createControlLine());
  }
  /**Remove PumpLine Control Control Time Row */
  removeControl(item, index) {
    this.control_blocks = item.get('control_blocks') as FormArray;
    this.control_blocks.removeAt(index);
  }
  
  createModalFormFnc(){
    this.modalForm = this.fb.group({
      value: ['', [Validators.required]],
      slave_id: ['', [Validators.required]],
      register_address: ['', [Validators.required]]
    });
  }  

  openValueDialog(item, field, b, ind, content, type, fieldtype){
    this.selectedInput = fieldtype;
    if(item && item.value && item.value.control_blocks[ind]) {
      let registerAddrVal = "", valueInputVal = "",slaveIdVal = "";;
      if(this.selectedInput === "startHour") {
        valueInputVal = item.value.control_blocks[ind].startHour;
        registerAddrVal = item.value.control_blocks[ind].startHourRegister;
        slaveIdVal= item.value.control_blocks[ind].startHourSlaveId;
      } else if(this.selectedInput === "startMinute") {
        valueInputVal = item.value.control_blocks[ind].startMinute;
        registerAddrVal = item.value.control_blocks[ind].startMinuteRegister;
        slaveIdVal= item.value.control_blocks[ind].startHourSlaveId;
      } else if(this.selectedInput === "endHour") {
        valueInputVal = item.value.control_blocks[ind].endHour;
        registerAddrVal = item.value.control_blocks[ind].endHourRegister;
        slaveIdVal= item.value.control_blocks[ind].startHourSlaveId;
      } else if(this.selectedInput === "endMinute") {
        valueInputVal = item.value.control_blocks[ind].endMinute;
        registerAddrVal = item.value.control_blocks[ind].endMinuteRegister;
        slaveIdVal= item.value.control_blocks[ind].startHourSlaveId;
      }
      this.modalForm.patchValue({
        value: valueInputVal,
        slave_id: slaveIdVal,
        register_address: registerAddrVal
      })
    } else {
      this.modalForm.reset();
    }
    this.modalRef = this.modalService.show(
      content,
      Object.assign({}, { class: 'compose-popup modal-sticky-bottom-right modal-sticky-lg', id: 'compose-email-popup', data: {
        item: item,
        field: field,
        b: b,
        ind: ind,
        type: type
      }})
    ); 
  }

  
  confirm(item, field, b, ind) {
    if (this.modalForm.invalid) {
      const invalid = [];
      const controls = this.modalForm.controls;
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
      this.controlForm.value.site_id = this.mimicId;
      item.controls['control_blocks'].at(ind).controls['register'].setValue(this.modalForm.value.register_address);
      item.controls['control_blocks'].at(ind).controls['slaveId'].setValue(this.modalForm.value.slave_id);
      item.controls['control_blocks'].at(ind).controls['value'].setValue(this.modalForm.value.value);
    }
    this.modalRef.hide();
  }

  saveMimicControl() {      
    this.controlForm.value.controls.forEach(element => {
      element.control_blocks.forEach(ele => {
        if(ele.value == ""){        
          var index = element.control_blocks.indexOf(ele);
          element.control_blocks.splice(index, 1);
        }
      });
    });
    const filteredItems = this.controlForm.value.controls.filter(function(item) {
      return item.control_blocks.length > 0
    })
    let dataObj = {
      controlsData: filteredItems,
      site_id: this.mimicId
    }
    this.mimicService.saveMimicControl(dataObj).subscribe(res => {
      if (res.code == 200) {
            this.toastr.success(res.message);
            this.router.navigate(["/admin/mimics/mimic_list"]);
      } else {
        this.toastr.error(res.message);
      }
    });
  }  

  patchControls(mimicData) {
    console.log('mimicData',mimicData);
    let controls = this.controlForm.get('controls') as FormArray;
    console.log('controls',controls);
    for (let i = 0; i < controls.length; i++) {
      controls.removeAt(i);
    }
    console.log('controls',controls);
    mimicData.forEach(x => {
      controls.push(this.fb.group({
        control_blocks: this.setControlBlocks(x) 
      }))
    })
  }

  setControlBlocks(x) {
    let arr = new FormArray([])
    x.control_blocks.forEach(y => {
      arr.push(this.fb.group({
        name: y.name,
        startMinute: y.startMinute,
        value: y.value,
        register: y.register,
        slaveId: y.slaveId,
      }))
    })
    return arr;
  }
}
