import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { MimicService } from "../../services/mimic/mimic.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';

@Component({
  selector: 'app-mimic-list',
  templateUrl: './mimic_list.component.html',
  styleUrls: []

})
export class MimicListComponent implements OnInit {

  userDetails: any;
  mimicsArr: any = [];
  searchString: any;
  options: any = {};
  page = 1;
  pageSize = 10;
  toggle: any = {
    title: false
  };
  selectedRecord: any = [];

  constructor(private router: Router, 
    private mimicService: MimicService,
    private fb: FormBuilder,
    private toastr: ToastrService) {
    //this.userDetails = JSON.parse(sessionStorage.admin_login).admindata; // fetching sessionStorage data of admin

    this.fetchMimics();
  }  

  ngOnInit() {}
  
  openConfirmationDialog() {
    if (confirm('Please confirm! Do you really want to delete the record(s) ?')) {
      this.deleteRecord()
    }
  }

  routeToAddMimic() {    
    this.router.navigate(["/admin/mimics/add_mimic"]);
  }

  sortMimic(field: any, order: any) {
    this.options.sort = field;
    this.options.order = order ? 1 : -1;
    this.fetchMimics();
  }

  selectAllMimicRecord(event){
    if (event.target.checked && event.target.checked == true) {
      $(".check_box_all").each(function(){
        $(this).prop("checked", true);
      });
      this.mimicsArr.forEach(element => {
        this.selectedRecord.push(element._id);
      });
    } else {
      $(".check_box_all").each(function(){
        $(this).prop("checked", false);
      });
      this.selectedRecord = [];
    }
  }

  selectMimicRecord(recordId, event){    
    if(event.target.checked && event.target.checked == true && this.selectedRecord.indexOf(recordId) === -1){
      this.selectedRecord.push(recordId);
    } else{
      let indexVal = this.selectedRecord.indexOf(recordId);
      this.selectedRecord.splice(indexVal, 1);
      $("#checkAllBox").prop("checked", false);
    }
  }

  delIndRecord(recordId){ //return false;
    if(this.selectedRecord.indexOf(recordId) === -1){
      this.selectedRecord.push(recordId);
    }
    this.openConfirmationDialog();
  }  

  deleteRecord(){
    if (this.selectedRecord && this.selectedRecord.length < 1) {
      this.toastr.error("Please select atleast one record to delete");
    } else {
      let dataObj = {
        records: this.selectedRecord
      }
      this.mimicService.deleteMimic(dataObj).subscribe(res => {
        if (res.code === 200) {
          this.toastr.success(res.message);          
          this.fetchMimics();
        }
        else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  searchMimic(){
    this.options.search = this.searchString;
    this.fetchMimics();
  }

  fetchMimics() {
    let dataObj = {
      options: this.options
    }
    this.mimicService.fetchMimicsData(dataObj).subscribe(res => {
      if (res.code === 200) {
        this.mimicsArr = res.result;
      }
      else {
        this.toastr.error(res.message);
      }
    });
  }

  

  editMimicDetails(mimicId) {    
    this.router.navigate(["/admin/mimics/edit_mimic", mimicId]);
  }  

  manageMimicDetails(mimicId) {    
    this.router.navigate(["/admin/mimics/studio", mimicId]);
  }  

  previewMimicDetails(mimicId) {    
    this.router.navigate(["/admin/mimics/preview", mimicId]);
  }  

  changeActivation(mimicId, activeVal){
    let dataObj = {
      mimicId: mimicId,
      is_blocked: activeVal == "block" ? 1 : 0
    }
    this.mimicService.changeMimicActivation(dataObj).subscribe(res => {
      if (res.code === 200) {
        this.toastr.success(res.message);
        this.fetchMimics();
      }
      else {
        this.toastr.error(res.message);
      }
    });
  }

}
