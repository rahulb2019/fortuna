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
import { UserService } from "../../services/user/user.service";
// import { EventService } from "../../services/event/event.service";
//import { ConfirmDialogService } from '../../services/confirm-dialog/confirm-dialog.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';

@Component({
  selector: 'app-user-list',
  templateUrl: './user_list.component.html',
  styleUrls: []

})
export class UserListComponent implements OnInit {

  @ViewChild('childModal', {static: false}) public childModal:ModalDirective;
  

  userDetails: any;
  usersArr: any = [];
  searchString: any;
  options: any = {};
  page = 1;
  pageSize = 10;
  toggle: any = {
    title: false
  };
  selectedRecord: any = [];
  fileReaded: any;
  csvtoArr: any = [];
  csvColumns: any = [];
  arrToCSV: any = [];
  importCompanyCSVForm: FormGroup;
  setDefaultEvent: any;
  default_event_type: any

  // breadCrumbItems = [
  //   {
  //     isActive: true,
  //     label: 'Companies',
  //     link: '/companies/company_list'
  //   }
  // ];

  constructor(private router: Router, 
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService) {
    //this.userDetails = JSON.parse(sessionStorage.admin_login).admindata; // fetching sessionStorage data of admin

    this.fetchUsers();
  }  

  ngOnInit() {}
  
  openConfirmationDialog() {
    if (confirm('Please confirm! Do you really want to delete the record(s) ?')) {
      this.deleteRecord()
    }
    // this.confirmDialogService.confirm('Please confirm!', 'Do you really want to delete the record(s) ?')
    // .then((confirmed) => confirmed == true ? this.deleteRecord() : false)
    // .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  routeToAddUser() {    
    this.router.navigate(["/admin/users/add"]);
  }

  sortCompany(field: any, order: any) {
    this.options.sort = field;
    this.options.order = order ? 1 : -1;
    this.fetchUsers();
  }

  selectAllCompRecord(event){
    if (event.target.checked && event.target.checked == true) {
      $(".check_box_all").each(function(){
        $(this).prop("checked", true);
      });
      this.usersArr.forEach(element => {
        this.selectedRecord.push(element._id);
      });
    } else {
      $(".check_box_all").each(function(){
        $(this).prop("checked", false);
      });
      this.selectedRecord = [];
    }
  }

  selectCompRecord(recordId, event){    
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
      this.userService.deleteUser(dataObj).subscribe(res => {
        if (res.code === 200) {
          this.toastr.success(res.message);          
          this.fetchUsers();
        }
        else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  searchUser(){
    this.options.search = this.searchString;
    this.fetchUsers();
  }

  fetchUsers() {
    let dataObj = {
      options: this.options
    }
    this.userService.fetchUsersData(dataObj).subscribe(res => {
      if (res.code === 200) {
        this.usersArr = res.result;
      }
      else {
        this.toastr.error(res.message); //alert error message
      }
    });
  }

  

  editOwnerDetails(ownerId) {    
    this.router.navigate(["/admin/users/edit_user", ownerId]);
  }  

  changeActivation(ownerId, activeVal){
    let dataObj = {
      ownerId: ownerId,
      is_blocked: activeVal == "block" ? 1 : 0
    }
    this.userService.changeActivationData(dataObj).subscribe(res => {
      if (res.code === 200) {
        this.toastr.success(res.message);
        this.fetchUsers();
      }
      else {
        this.toastr.error(res.message); //alert error message
      }
    });
  }

}
