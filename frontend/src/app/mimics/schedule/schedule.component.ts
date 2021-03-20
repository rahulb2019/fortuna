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
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: []
})
export class ScheduleComponent implements OnInit {

  scheduleForm: FormGroup;
  modalForm: FormGroup;

  schedules: FormArray;
  schedule_blocks: FormArray;
  modalRef: BsModalRef;
  
  isSubmitted: boolean;
  isValid: boolean = true;
  errorField: string;
  mimicId: any;
  totalPumpsAdded: any;
  selectedInput: any;

  hourJsonArr: any = [
    { key: "1", value: "1" }, 
    { key: "2", value: "2" },    
    { key: "3", value:"3" },    
    { key: "4", value:"4" },    
    { key: "5", value:"5" },    
    { key: "6", value:"6" },    
    { key: "7", value:"7" },    
    { key: "8", value:"8" },    
    { key: "9", value:"9" },    
    { key: "10", value:"10" },    
    { key: "11", value:"11" },    
    { key: "12", value:"12" },    
    { key: "13", value:"13" },    
    { key: "14", value:"14" },    
    { key: "15", value:"15" },    
    { key: "16", value:"16" },    
    { key: "17", value:"17" },    
    { key: "18", value:"18" },    
    { key: "19", value:"19" },    
    { key: "20", value:"20" },    
    { key: "21", value:"21" },    
    { key: "22", value:"22" },    
    { key: "23", value:"23" },    
    { key: "24", value:"24" }
  ]

  minuteJsonArr: any = [
    { key: "05", value:"05" },    
    { key: "10", value:"10" },    
    { key: "15", value:"15" },    
    { key: "20", value:"20" },    
    { key: "25", value:"25" },    
    { key: "30", value:"30" },    
    { key: "35", value:"35" },    
    { key: "40", value:"40" },    
    { key: "45", value:"45" },    
    { key: "50", value:"50" },    
    { key: "55", value:"55" },    
    { key: "60", value:"60" }
  ]

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
    this.createScheduleForm();
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
        this.getMimicScheduleData();
      }
      else {        
        this.toastr.error(res.message); //alert error message
      }
    });
  }

  getMimicScheduleData(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getScheduleData(dataObj).subscribe(res => {
      if (res.code === 200) {
        let schedulesData = [];
        let scheduleDataResponse = res.result.length > 0 ? res.result[0] : [];
        scheduleDataResponse && scheduleDataResponse.forEach(element => {
          schedulesData.push(element);
        });
        if(schedulesData && schedulesData.length > 0){
          this.scheduleForm.patchValue(scheduleDataResponse);
          this.patchSchedules(schedulesData);
        }
      }
    });
  }

  createScheduleForm(){
    this.scheduleForm = this.fb.group({    
      schedules: this.fb.array([this.createScheduleBlock()]),
    });
  }

  /**Create Schedule Block*/
  createScheduleBlock() {
    return this.fb.group({
      pumpValue: [''],
      schedule_blocks: this.fb.array([this.createScheduleLine()])
    });
  }

  /**Create Pump Key-Value schedule line*/
  createScheduleLine() {
    return this.fb.group({
      startHour: ['', [Validators.required]],
      startMinute: ['', [Validators.required]],
      endHour: ['', [Validators.required]],
      endMinute: ['', [Validators.required]],
      startHourSlaveId: ['', [Validators.required]],
      startMinuteSlaveId: ['', [Validators.required]],
      endHourSlaveId: ['', [Validators.required]],
      endMinuteSlaveId: ['', [Validators.required]],
      startHourRegister: ['', [Validators.required]],
      startMinuteRegister: ['', [Validators.required]],
      endHourRegister: ['', [Validators.required]],
      endMinuteRegister: ['', [Validators.required]],
    });
  }

  /**Create Pump Schedule */
  addPumpScBlock(){
    this.schedules = this.scheduleForm.get('schedules') as FormArray;
    if(this.schedules.value.length < this.totalPumpsAdded.length) {
      this.schedules.push(this.createScheduleBlock());
    } else {
      this.toastr.error("You cannot add schedule more than Pumps added to site");
    }
  }

  /**Remove Pump Schedule */
  removePumpScBlock(index){
    this.schedules = this.scheduleForm.get('schedules') as FormArray;
    this.schedules.removeAt(index);
  }

  /**Create Pump Line Schedule Time Row */
  addSchedule(item) {
    this.schedule_blocks = item.get('schedule_blocks') as FormArray;
    if(this.schedule_blocks.value.length < 4) {
      this.schedule_blocks.push(this.createScheduleLine());
    } else {
      this.toastr.error("You cannot add more than 4 schedules for a pump");
    }
  }
  /**Remove PumpLine Schedule Schedule Time Row */
  removeSchedule(item, index) {
    this.schedule_blocks = item.get('schedule_blocks') as FormArray;
    this.schedule_blocks.removeAt(index);
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
    if(item && item.value && item.value.schedule_blocks[ind]) {
      let registerAddrVal = "", valueInputVal = "",slaveIdVal = "";;
      if(this.selectedInput === "startHour") {
        valueInputVal = item.value.schedule_blocks[ind].startHour;
        registerAddrVal = item.value.schedule_blocks[ind].startHourRegister;
        slaveIdVal= item.value.schedule_blocks[ind].startHourSlaveId;
      } else if(this.selectedInput === "startMinute") {
        valueInputVal = item.value.schedule_blocks[ind].startMinute;
        registerAddrVal = item.value.schedule_blocks[ind].startMinuteRegister;
        slaveIdVal= item.value.schedule_blocks[ind].startHourSlaveId;
      } else if(this.selectedInput === "endHour") {
        valueInputVal = item.value.schedule_blocks[ind].endHour;
        registerAddrVal = item.value.schedule_blocks[ind].endHourRegister;
        slaveIdVal= item.value.schedule_blocks[ind].startHourSlaveId;
      } else if(this.selectedInput === "endMinute") {
        valueInputVal = item.value.schedule_blocks[ind].endMinute;
        registerAddrVal = item.value.schedule_blocks[ind].endMinuteRegister;
        slaveIdVal= item.value.schedule_blocks[ind].startHourSlaveId;
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
      this.scheduleForm.value.site_id = this.mimicId;
      if(this.selectedInput === "startHour") {
        item.controls['schedule_blocks'].at(ind).controls['startHourRegister'].setValue(this.modalForm.value.register_address);
        item.controls['schedule_blocks'].at(ind).controls['startHourSlaveId'].setValue(this.modalForm.value.slave_id);
      } else if(this.selectedInput === "startMinute") {
        item.controls['schedule_blocks'].at(ind).controls['startMinuteRegister'].setValue(this.modalForm.value.register_address);
        item.controls['schedule_blocks'].at(ind).controls['startMinuteSlaveId'].setValue(this.modalForm.value.slave_id);
      } else if(this.selectedInput === "endHour") {
        item.controls['schedule_blocks'].at(ind).controls['endHourRegister'].setValue(this.modalForm.value.register_address);        
        item.controls['schedule_blocks'].at(ind).controls['endHourSlaveId'].setValue(this.modalForm.value.slave_id);
      } else if(this.selectedInput === "endMinute") {
        item.controls['schedule_blocks'].at(ind).controls['endMinuteRegister'].setValue(this.modalForm.value.register_address);        
        item.controls['schedule_blocks'].at(ind).controls['endMinuteSlaveId'].setValue(this.modalForm.value.slave_id);
      }
      item.controls['schedule_blocks'].at(ind).controls[this.selectedInput].setValue(this.modalForm.value.value);
    }
    this.modalRef.hide();
  }

  saveMimicSchedule() {      
    this.scheduleForm.value.schedules.forEach(element => {
      element.schedule_blocks.forEach(ele => {
        if(ele.startHour == "" || ele.startMinute == "" || ele.endHour == "" || ele.endMinute == ""){        
          var index = element.schedule_blocks.indexOf(ele);
          element.schedule_blocks.splice(index, 1);
        }
      });
    });
    const filteredItems = this.scheduleForm.value.schedules.filter(function(item) {
      return item.schedule_blocks.length > 0
    })
    let dataObj = {
      schedulesData: filteredItems,
      site_id: this.mimicId
    }
    this.mimicService.saveMimicSchedule(dataObj).subscribe(res => {
      if (res.code == 200) {
            this.toastr.success(res.message);
            this.router.navigate(["/admin/mimics/mimic_list"]);
      } else {
        this.toastr.error(res.message);
      }
    });
  }  

  patchSchedules(mimicData) {
    let schedules = this.scheduleForm.get('schedules') as FormArray;
    for (let i = 0; i < schedules.length; i++) {
      schedules.removeAt(i);
    }
    mimicData.forEach(x => {
      schedules.push(this.fb.group({
        pumpValue: x.pumpValue,
        schedule_blocks: this.setScheduleBlocks(x) 
      }))
    })
  }

  setScheduleBlocks(x) {
    let arr = new FormArray([])
    x.schedule_blocks.forEach(y => {
      arr.push(this.fb.group({
        startHour: y.startHour,
        startMinute: y.startMinute,
        endHour: y.endHour,
        endMinute: y.endMinute,
        startHourRegister: y.startHourRegister,
        startMinuteRegister: y.startMinuteRegister,
        endHourRegister: y.endHourRegister,
        endMinuteRegister: y.endMinuteRegister,
        startHourSlaveId: y.startHourSlaveId,
        startMinuteSlaveId: y.startMinuteSlaveId,
        endHourSlaveId: y.endHourRegister,
        endMinuteSlaveId: y.endMinuteSlaveId,
      }))
    })
    return arr;
  }
}
