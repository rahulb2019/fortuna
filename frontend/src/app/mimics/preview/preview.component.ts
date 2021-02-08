import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

import {NgbModal, ModalDismissReasons}  
      from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute, Router } from "@angular/router";
import { MimicService } from "../../services/mimic/mimic.service";
import * as $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';

@Component({
  selector: 'app-mimic',
  templateUrl: './preview.component.html',
  styleUrls: []

})
export class PreviewComponent implements OnInit {

  mimicId: any;
  pumpsCount: any;
  statsForm: FormGroup;
  blocks: FormArray;
  details: FormArray;
  closeResult = '';
  mimicDataArray: any;

  modalForm: FormGroup;
  modalRef: BsModalRef;
  isSubmitted: boolean;
  isValid: boolean = true;
  errorField: string;

  constructor(public apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private mimicService: MimicService,
    private activatedRoute: ActivatedRoute, private modalService: BsModalService,
    private toastr: ToastrService) {
    this.activatedRoute.params.subscribe(params => {
      this.mimicId = params.id;
      this.getMimicDataById();
    });
    this.createStatsFormFnc();
    this.createModalFormFnc();
  }

  ngOnInit() {
    var images =  JSON.parse(localStorage.getItem('currentMimic'));
    this.displayExistingMimic(images);
  }

  
  createModalFormFnc(){
    this.modalForm = this.fb.group({
      slave_id: ['', [Validators.required]],
      register_address: ['', [Validators.required]],
      data_type: ['', [Validators.required]],
      unit: ['', [Validators.required]]
    });
  }

  createStatsFormFnc(){
    this.statsForm = this.fb.group({      
      blocks: this.fb.array([this.createStatBlock()]),
    });
  }

  /**Create Pump Block*/
  createStatBlock() {
    return this.fb.group({
      details: this.fb.array([this.createStatItemBlock()])
    });
  }

  /**Create Pump Key-Value Block*/
  createStatItemBlock() {
    return this.fb.group({
      name: [''],
      value: [''],
      slave_id: [''],
      register_address: [''],
      data_type: [''],
      unit: ['']
    });
  }

  /**Create Line Item Block */
  addRow(item) {
    this.details = item.get('details') as FormArray;
    this.details.push(this.createStatItemBlock());
  }
  /**Remove Line Item Block */
  removeRow(item, detailblock, index) {
    this.details = item.get('details') as FormArray;
    this.details.removeAt(index);
  }
  
  getMimicDataById(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getMimicDetail(dataObj).subscribe(res => {  
      if (res.code === 200) {
        if (res.result[0] && res.result[0].mimic_data.length > 0) {
          this.mimicDataArray = res.result[0].mimic_data;
          this.pumpsCount = res.result[0].no_of_pumps
          this.getMimicBlocksData();
          this.displayExistingMimic(this.mimicDataArray);
          //this.patchBlocks(this.pumpsCount);
        }
      }
    });
  }

  getMimicBlocksData(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getBlocksData(dataObj).subscribe(res => {
      if (res.code === 200) {
        let blocksData = [];
        let blockDataResponse = res.result.length > 0 ? res.result[0] : [];
        blockDataResponse && blockDataResponse.forEach(element => {
          blocksData.push(element);
        });
        this.statsForm.patchValue(blockDataResponse);
        this.patchBlocks(blocksData);
      }
    });
  }

  patchBlocks(mimicData) {
    let blocks = this.statsForm.get('blocks') as FormArray;
    for (let i = 0; i < blocks.length; i++) {
      blocks.removeAt(i);
    }
    mimicData.forEach(x => {
      blocks.push(this.fb.group({ 
        details: this.setDetails(x) }))
    })
  }

  setDetails(x) {
    let arr = new FormArray([])
    x.details.forEach(y => {
      arr.push(this.fb.group({
        data_type: y.data_type,
        name: y.name,
        register_address: y.register_address,
        slave_id: y.slave_id,
        unit: y.unit,
        value: y.value,
      }))
    })
    return arr;
  }

  displayExistingMimic(mimicData) {
    $('.iq-sidebar').remove();
    $('.iq-top-navbar').remove();
    $('.content-page').css({'padding':0,'margin':0});
    let html='';
    mimicData && mimicData.forEach(element => {
      html+='<div class="drag" style="'+element.style+'">';
      html+='<img src="'+element.image+'" width="100%" height="100%">';
      html+='</div>';      
    });
    $('#droppable').html(html);
  }

  openValueDialog(item, field, b, ind, content){ 
    console.log(item, field, b, ind);
    if(item && item.value && item.value.details[ind] && item.value.details[ind].slave_id) {
      this.modalForm.patchValue({
        slave_id: item.value.details[ind].slave_id,
        register_address: item.value.details[ind].register_address,
        data_type: item.value.details[ind].data_type,
        unit: item.value.details[ind].unit
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
        ind: ind
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
      this.statsForm.value.site_id = this.mimicId;
      item.controls['details'].at(ind).controls['data_type'].setValue(this.modalForm.value.data_type);
      item.controls['details'].at(ind).controls['register_address'].setValue(this.modalForm.value.register_address);
      item.controls['details'].at(ind).controls['slave_id'].setValue(this.modalForm.value.slave_id);
      item.controls['details'].at(ind).controls['unit'].setValue(this.modalForm.value.unit);
    }
    this.modalRef.hide();
  }

  saveAll(){      
    this.statsForm.value.blocks.forEach(element => {
      element.details.forEach(ele => {
        if(ele.name == ""){        
          var index = element.details.indexOf(ele);
          element.details.splice(index, 1);
        }
      });
    });
    const filteredItems = this.statsForm.value.blocks.filter(function(item) {
      return item.details.length > 0
    })
    let dataObj = {
      blocksData: filteredItems,
      site_id: this.mimicId
    }
    this.mimicService.saveBlocksData(dataObj).subscribe(res => {
      if (res.code == 200) {
            this.toastr.success(res.message);
            this.router.navigate(["/admin/mimics/preview/", this.mimicId]);
      } else {
        this.toastr.error(res.message);
      }
    });
  }
}
