import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-mimic',
  templateUrl: './run.component.html',
  styleUrls: []

})
export class RunComponent implements OnInit, OnDestroy {

  mimicId: any;
  pumpsCount: any;
  statsForm: FormGroup;
  blocks: FormArray;
  details: FormArray;
  closeResult = '';
  mimicDataArray: any;
  pumpData: any;

  modalForm: FormGroup;
  modalRef: BsModalRef;
  isSubmitted: boolean;
  isValid: boolean = true;
  errorField: string;
  meterDataArray: any;

  document: any=[];
  private _docSub: Subscription;

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
  }

  ngOnInit() {
    var images =  JSON.parse(localStorage.getItem('currentMimic'));
    this.displayExistingMimic(images);
    this._docSub = this.mimicService.currentDocument.subscribe(result => 
    {  
      var res=result[0].site_blocks;
      this.document=res;
      this.meterDataArray = result[0].meter_data;
      console.log(res);
      let responseArray = res ? Object.entries(res) : []
      this.pumpData=res[0].pumpData;
      var ang=this;
      //find active pumps
      var offPumpArr=[];
      var onPumpArr=[];
      responseArray.forEach((data, i) => {
        if(($("input[name='Pumps "+(i+1)+"']").val())==='ON'){
          if($("img[title='Pumps "+(i+1)+"']").length >0){
            let offImg=$("img[title='Pumps "+(i+1)+"']").attr('src');
            console.log(offImg);
            let onImg=offImg.replace("_off.svg", "_on.gif");
            if(onImg.indexOf("_off.png") !== -1)
              onImg=onImg.replace("_off.png", "_on.gif");
            $("img[title='Pumps "+(i+1)+"']").attr('src',onImg);
            console.log($("img[title='Pumps "+(i+1)+"']").offset())
            let el=ang.getClosestElement($("img[title='Pumps "+(i+1)+"']").offset().left, $("img[title='Pumps "+(i+1)+"']").offset().top);
            let offImgConnector=el.find('img').attr('src');
            let onImgConnector=offImgConnector.replace("_off.svg", "_on.svg");
            if(onImgConnector.indexOf("_off.png") !== -1)
              onImgConnector=onImgConnector.replace("_off.png", "_on.svg");
            el.find('img').attr('src',onImgConnector);
            onPumpArr.push(String(i+1));
          }
        }
        else{
            if($("img[title='Pumps "+(i+1)+"']").length >0)
            {
              let offImg=$("img[title='Pumps "+(i+1)+"']").data('off-src');
              $("img[title='Pumps "+(i+1)+"']").attr('src',offImg);
              let el=ang.getClosestElement($("img[title='Pumps "+(i+1)+"']").offset().left, $("img[title='Pumps "+(i+1)+"']").offset().top);
              let offImgConnector=el.find('img').data('off-src');
              el.find('img').attr('src',offImgConnector);
            }
            offPumpArr.push(String(i+1));
        }
        $("img[title='Pipes']").each(function(){
          $(this).attr('src',$(this).data('off-src'));
        });
      });
      //rerun to mark pump on
      responseArray.forEach((data, i) => {
        if(($("input[name='Pumps "+(i+1)+"']").val())==='ON'){
          $("img[title='Pipes']").each(function(){
              let indexPipe=$(this).data('index');
              var index = ang.pumpData.findIndex((el, index) => {
                if ((el.element === indexPipe) && (el.pumps.indexOf(String(i+1)) !== -1)) {
                  return true
                }
              });
              if (index!==-1)
              {
                let offImg=$(this).attr('src');
                let onImg=offImg.replace("_off.svg", "_on.gif");
                if(onImg.indexOf("_off.png") !== -1)
                  onImg=onImg.replace("_off.png", "_on.gif");
                $(this).attr('src',onImg);
              }
            });
        }
      });
      
    });
    this.mimicService.getDocument(this.mimicId);
  }
  ngOnDestroy() {
    this._docSub.unsubscribe();
  }
  getClosestElement(x, y){
    const elements = $('body *');
    let closestEl = elements.eq(0); //initialize to first element
    let offset = closestEl.offset();
    offset.left += closestEl.outerWidth() / 2; // center of object
    offset.top += closestEl.outerHeight() / 2; // middle of object
    let minDist = Math.sqrt((offset.left - x) * (offset.left - x) + (offset.top - y) * (offset.top - y));
  
    elements.each((i) => {
      const el = elements.eq(i);
      offset = el.offset();
      offset.left += el.outerWidth() / 2; // center of object
      offset.top += el.outerHeight() / 2; // middle of object
      const dist = Math.sqrt((offset.left - x) * (offset.left - x) + (offset.top - y) * (offset.top - y));
      if (dist < minDist) {
        minDist = dist;
        closestEl = el;
      }
    });
    return closestEl;
  };

  
  getMimicDataById(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getMimicDetail(dataObj).subscribe(res => {  
      if (res.code === 200) {
        console.log("-----res.result[0]...", res.result[0]);
        if (res.result[0] && res.result[0].mimic_data.length > 0) {
          this.mimicDataArray = res.result[0].mimic_data;
          this.displayExistingMimic(this.mimicDataArray);
          this.meterDataArray = res.result[0].meter_data;
          this.pumpsCount = res.result[0].no_of_pumps
        }
      }
    });
  }


  displayExistingMimic(mimicData) {
    $('.iq-sidebar').remove();
    $('.iq-top-navbar').remove();
    $('.content-page').css({'padding':0,'margin':0});
    $('.mn-studio #droppable').css({'background-image':'none','margin-top':'25px'});
    let html='';
    let index=0;
    mimicData && mimicData.forEach(element => {
      html+='<div class="drag" style="'+element.style+'">';
      if (element.name == 'Flow Meter' || element.name == 'Pressure Meter') {
        html+='<div class="meter_tooltip"><span class="meter_tooltiptext">'+element.name+': <br/>'+element.value+' '+element.unit+'</span></div>';
      }
      html+='<img data-off-src="'+element.image+'"  src="'+element.image+'" title="'+element.name+'" width="100%" height="100%" data-index="'+index+'">';
      html+='</div>'; 
      index++;     
    });
    $('#droppable').html(html);
  }
}
