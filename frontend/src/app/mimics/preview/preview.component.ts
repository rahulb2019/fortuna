import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { NgbModal, ModalDismissReasons }
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

  //@ViewChild("ele", { static: false }) ele;

  mimicId: any;
  pumpsCount: any;
  statsForm: FormGroup;
  blocks: FormArray;
  details: FormArray;
  closeResult = '';
  mimicDataArray: any;
  pumpData: any;

  modalForm: FormGroup;
  modalFormPump: FormGroup;
  modalRef: BsModalRef;
  modalPumpRef: BsModalRef;
  isSubmitted: boolean;
  isValid: boolean = true;
  errorField: string;

  document: any;
  blockDataResponse: any;


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
    this.pumpData = [];
  }

  ngOnInit() {
    var images = JSON.parse(localStorage.getItem('currentMimic'));
    this.displayExistingMimic(images);
    this.mimicDataArray = images;
    //this.openMeterValueDialog();
  }

  createModalFormFnc() {
    this.modalForm = this.fb.group({
      slave_id: ['', [Validators.required]],
      register_address: ['', [Validators.required]],
      data_type: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      register_type: ['0', [Validators.required]],
      division_factor: [''],
    });
    this.modalFormPump = this.fb.group({
      pumps: ['', [Validators.required]],
      element: ['']
    });
  }

  createStatsFormFnc() {
    this.statsForm = this.fb.group({
      blocks: this.fb.array([this.createStatBlock()]),
    });
  }

  /**Create Pump Block*/
  createStatBlock() {
    return this.fb.group({
      pumpValue: [''],
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
      unit: [''],
      register_type: ['0'],
      division_factor: ['']
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

  getMimicDataById() {
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

  getMimicBlocksData() {
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getBlocksData(dataObj).subscribe(res => {
      if (res.code === 200) {
        let blocksData = [];
        this.blockDataResponse = res.result.length > 0 ? res.result[0] : [];
        this.blockDataResponse && this.blockDataResponse.forEach(element => {
          blocksData.push(element);
          this.pumpData = element.pumpData
        });
        this.statsForm.patchValue(this.blockDataResponse);
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
        pumpValue: x.pumpValue,
        details: this.setDetails(x)
      }))
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
        register_type: y.register_type,
        division_factor: y.division_factor
      }))
    })
    return arr;
  }

  displayExistingMimic(mimicData) {
    $('.iq-sidebar').remove();
    $('.iq-top-navbar').remove();
    $('.content-page').css({ 'padding': 0, 'margin': 0 });
    $('.mn-studio #droppable').css({ 'background-image': 'none', 'margin-top': '25px' });
    $('#droppable').hide();
    let html = '';
    var pipe = 0;
    mimicData && mimicData.forEach(element => {
      html += '<div class="drag" style="' + element.style + '">';
      let title = element.name;
      if (title == 'Pipes') {
        pipe++;
        title = 'Pipe ' + pipe;
        html += '<img src="' + element.image + '" title="' + title + '" width="100%" height="100%" class="pipes" (mouseDown)="openModal(template)" >';
      }
      else {
        html += '<img src="' + element.image + '" title="' + title + '" width="100%" height="100%">';
      }
      html += '</div>';
    });
    setTimeout(() => {
      $('.drag').each(function () {
        $(this).attr('style', $(this).attr('stylea'));
        $(this).removeAttr('stylea');
      })
      $('#droppable').show();
    }, 300);

    // $('#droppable').html(html);
    // var ang=this;
    // $('.pipes').click(function(){
    //   ang.modalRef = ang.modalService.show(
    //     Object.assign({}, { class: 'compose-popup modal-sticky-bottom-right modal-sticky-lg', id: 'compose-email-popup1', data: {

    //     }})
    //   ); 
    // })

  }
  openModal(content, i) {
    var index = this.pumpData.findIndex((el, index) => {
      if (el.element === i) {
        return true
      }
    })
    if (index !== -1) {
      this.modalFormPump.patchValue({ pumps: this.pumpData[index].pumps });
    }
    else
      this.modalFormPump.patchValue({ pumps: 0 });
    this.modalFormPump.patchValue({ element: i });
    this.modalPumpRef = this.modalService.show(
      content,
      Object.assign({}, { class: 'compose-popup modal-sticky-bottom-right modal-sticky-lg', id: 'template-popup' })
    );
  }

  savePipeAssociation() {
    var index = this.pumpData.findIndex((el, index) => {
      if (el.element === this.modalFormPump.value.element) {
        return true
      }
    })
    if (index === -1)
      this.pumpData.push(this.modalFormPump.value);
    else
      this.pumpData[index] = this.modalFormPump.value;
    this.modalPumpRef.hide();
  }


  openMeterDialog(content, ind) {
    if (this.mimicDataArray && this.mimicDataArray[ind] && this.mimicDataArray[ind].slave_id) {
      let itemObj = this.mimicDataArray[ind];
      this.modalForm.patchValue({
        slave_id: itemObj.slave_id,
        register_address: itemObj.register_address,
        data_type: itemObj.data_type,
        unit: itemObj.unit,
        register_type: 0,
        division_factor: itemObj.division_factor
      })
    } else {
      this.modalForm.reset();
    }
    this.modalRef = this.modalService.show(
      content,
      Object.assign({}, {
        class: 'compose-popup modal-sticky-bottom-right modal-sticky-lg', id: 'compose-email-popup', data: {
          ind: ind
        }
      })
    );
  }


  openValueDialog(item, field, b, ind, content) {
    if (item && item.value && item.value.details[ind] && item.value.details[ind].slave_id) {
      this.modalForm.patchValue({
        slave_id: item.value.details[ind].slave_id,
        register_address: item.value.details[ind].register_address,
        data_type: item.value.details[ind].data_type,
        unit: item.value.details[ind].unit,
        register_type: item.value.details[ind].register_type || 0,
        division_factor: item.value.details[ind].division_factor
      })
    } else {
      this.modalForm.reset();
    }
    this.modalRef = this.modalService.show(
      content,
      Object.assign({}, {
        class: 'compose-popup modal-sticky-bottom-right modal-sticky-lg', id: 'compose-email-popup', data: {
          item: item,
          field: field,
          b: b,
          ind: ind
        }
      })
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
      item.controls['details'].at(ind).controls['register_type'].setValue(this.modalForm.value.register_type);
      item.controls['details'].at(ind).controls['division_factor'].setValue(this.modalForm.value.division_factor);
    }
    this.modalRef.hide();
  }

  confirmSaveMeter(ind) {
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
      this.mimicDataArray[ind].data_type = this.modalForm.value.data_type;
      this.mimicDataArray[ind].register_address = this.modalForm.value.register_address;
      this.mimicDataArray[ind].slave_id = this.modalForm.value.slave_id;
      this.mimicDataArray[ind].unit = this.modalForm.value.unit;
      this.mimicDataArray[ind].value = "";
      this.mimicDataArray[ind].register_type = this.modalForm.value.register_type;
      this.mimicDataArray[ind].division_factor = this.modalForm.value.division_factor;
      let meterObj = {
        site_id: this.mimicId,
        mimic_data: this.mimicDataArray
      }
      this.mimicService.saveMetersData(meterObj).subscribe(res => {
        if (res.code == 200) {
          this.modalRef.hide();
        } else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  saveAll() {
    let dataObj = {
      blocksData: this.statsForm.value.blocks,
      site_id: this.mimicId,
      pumpData: this.pumpData
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
