import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import * as $ from 'jquery';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MimicService } from "../../services/mimic/mimic.service";

import * as moment from 'moment';
const DATE_FORMATE = 'DD/MM/YYYY';

@Component({
  selector: 'app-cumulative-report',
  templateUrl: './cumulative_report.component.html',
  styleUrls: []
})
export class CumulativeReportComponent implements OnInit {

  dropdownSettings:IDropdownSettings;
  userDetails: any;
  dataArr: any = [];
  sitesArr: any = [];
  searchString: any;
  options: any = {};
  page = 1;
  pageSize = 10;
  mimicType = 0;
  selectedSiteId = "";
  selectedSiteData: any = {};
  dateFromVal: any = "";
  dateToVal: any = "";
  timeFromVal: any = "";
  timeToVal: any = "";
  tagsArr: any = [];
  selectedTags = [];
  storedSites: any;
  permittedSitesArr: any;

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }
  };

  constructor(
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private exportAsService: ExportAsService,
    private mimicService: MimicService) {
      this.storedSites = JSON.parse(sessionStorage.getItem('admin_login')).admindata.selectedSites;
      this.permittedSitesFnc(this.storedSites);
      this.fetchMimics();
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      maxHeight: 200
    };
  }
  
  permittedSitesFnc(sitesAvail){
    this.permittedSitesArr = sitesAvail.map(function(value) {
      return value._id;
    });
  }

  fetchMimics() {
    let dataObj = {permittedSites: this.permittedSitesArr}
    this.mimicService.fetchMimicsData(dataObj).subscribe(res => {
      if (res.code === 200) {
        this.sitesArr = res.result;
        this.selectedSiteId = res.result[0]._id;
        this.setSelectedSiteFnc(this.selectedSiteId, this.sitesArr);
        // this.fetchCumulativeData(this.selectedSiteId);
        // $('#mytable').hide();
      }
      else {
        this.toastr.error(res.message);
      }
    });
  }

  changeSiteSelection(event) {
    this.selectedSiteId = event.target.value
    this.setSelectedSiteFnc(this.selectedSiteId, this.sitesArr);
    // $('#mytable').hide();
    // this.fetchCumulativeData(this.selectedSiteId);
  }
  

  changeMimicType(mimicVal){
    this.mimicType = mimicVal == 'zps' ? 0 : 1;
  }

  exportAsString(type: SupportedExtensions, opt?: string) {
    this.config.elementIdOrContent = '<div> test string </div>';
    this.exportAs(type, opt);
    setTimeout(() => {
      this.config.elementIdOrContent = 'mytable';
    }, 1000);
  }

  exportAs(type: SupportedExtensions, opt?: string) {
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
    }
    this.exportAsService.save(this.config, 'Fortuna').subscribe(() => {
      // save started
    });
    // this.exportAsService.get(this.config).subscribe(content => {
    //   const link = document.createElement('a');
    //   const fileName = 'export.pdf';

    //   link.href = content;
    //   link.download = fileName;
    //   link.click();
    //   console.log(content);
    // });
  }

  pdfCallbackFn (pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
    }
  }

  searchData(){
    this.options.search = this.searchString;
    this.fetchCumulativeData(this.selectedSiteId);
  }

  fetchCumulativeData(selectedSiteIdVal) {
    $('#mytable').show();
    let dataObj = {
      options: this.options,
      selectedSite: selectedSiteIdVal
    }
    this.mimicService.fetchCumulativeData(dataObj).subscribe(res => {
      if (res.code === 200) {
        this.dataArr = res.result;
        console.log(this.dataArr[0]);
        const currentEl = this;
        this.dataArr[0].pumpData.map(function(val, index){
          val.map(function(innerVal){
            Object.keys(innerVal).forEach(function eachKey(keyName) { 
              const name =`Pump ${index+1} - ${keyName}`;
              currentEl.tagsArr.push({'id': currentEl.convertToSlug(name),name});
            });
          })
        })
        this.dataArr[0].meterData.map(function(val, index){
          Object.keys(val).forEach(function eachKey(keyName) { 
            const name =`Meter ${index+1} - ${keyName}`;
            currentEl.tagsArr.push({'id': currentEl.convertToSlug(name),name});
          });
        })
        currentEl.tagsArr.push({'id': currentEl.convertToSlug(`Flow Meter`),name:`Flow Meter`});
        currentEl.tagsArr.push({'id': currentEl.convertToSlug(`Level Sensor`),name:`Level Sensor`});
        currentEl.selectedTags=currentEl.tagsArr;
      }
      else {
        this.toastr.error(res.message);
      }
    });
  }
  convertToSlug(text) {
    return text.toLowerCase().replace(/ /g, '').replace(/[^\w-]+/g, '');
  }
  changeTagSelection(event){
    console.log(event);
    const selectedTags = event.target.value;
    console.log(selectedTags);
  }
  
  setFilter(key, value): void {
    this.options[key] = value;
    setTimeout(() => {
      this.fetchCumulativeData(this.selectedSiteId);      
    }, 500);
  }

  setSelectedSiteFnc(siteId, siteArray): void {
    this.selectedSiteData = siteArray.find(x => x._id === siteId);
  }

  counter(i: number) {
    console.log("i....", i)
    return new Array(i);
  }

  getTotalHours(hoursArray) {
    let total = 0;
  
    hoursArray.forEach((item) => {
      total += Number(item.runningHours);
    });
  
    return total;
  } 

  getPumpDataLength(objPump){
    return Object.keys(objPump).length;
  }  

  getMeterDataLength(objMeter){
    return Object.keys(objMeter).length;
  }

  selectDateFrom(event){    
    this.dateFromVal = moment(event.target.value).format(DATE_FORMATE);
    this.options["fromDate"] = this.dateFromVal;
  }

  selectDateTo(event){
    this.dateToVal = moment(event.target.value).format(DATE_FORMATE);
    this.options["toDate"] = this.dateToVal;
  }

  selectTimeFrom(event){
    this.timeFromVal = event.target.value;
    this.options["fromTime"] = this.timeFromVal;
  }

  selectTimeTo(event){
    this.timeToVal = event.target.value;
    this.options["toTime"] = this.timeToVal;
  }
  onChangeTag(item: any) {
    this.hideShowColumn();
  }
  onChangeAllTag(items: any) {
    this.selectedTags = items;
    this.hideShowColumn();
  }
  hideShowColumn(){
    console.log(this.tagsArr);
    console.log(this.selectedTags);
    this.tagsArr.map(function(val){
      $('.'+val.id).hide();
    });
    this.selectedTags.map(function(val){
      $('.'+val.id).show();
    })
  }
  
}

