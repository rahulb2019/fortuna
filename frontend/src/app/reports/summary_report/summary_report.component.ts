import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MimicService } from "../../services/mimic/mimic.service";

import * as moment from 'moment';
import * as $ from 'jquery';
const DATE_FORMATE = 'DD/MM/YYYY';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary_report.component.html',
  styleUrls: []
})
export class SummaryReportComponent implements OnInit {

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
      this.fetchMimics();
  }

  ngOnInit() {
  }

  fetchMimics() {
    let dataObj = {}
    this.mimicService.fetchMimicsData(dataObj).subscribe(res => {
      if (res.code === 200) {
        this.sitesArr = res.result;
        this.selectedSiteId = res.result[0]._id;
        this.setSelectedSiteFnc(this.selectedSiteId, this.sitesArr);
        // this.fetchSummaryData(this.selectedSiteId);
        $('#mytable').hide();
      }
      else {
        this.toastr.error(res.message);
      }
    });
  }

  changeSiteSelection(event) {
    this.selectedSiteId = event.target.value
    this.setSelectedSiteFnc(this.selectedSiteId, this.sitesArr);
    // this.fetchSummaryData(this.selectedSiteId);
    $('#mytable').hide();
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
    let flName = "fortuna_" + new Date().getTime();
    this.exportAsService.save(this.config, flName).subscribe(() => {
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
    this.fetchSummaryData(this.selectedSiteId);
  }

  fetchSummaryData(selectedSiteIdVal) {
    $('#mytable').show();
    let dataObj = {
      options: this.options,
      selectedSite: selectedSiteIdVal
    }
    this.mimicService.fetchSummaryDataFnc(dataObj).subscribe(res => {
      if (res.code === 200) {
        this.dataArr = res.result;
      }
      else {
        this.toastr.error(res.message);
      }
    });
  }

  
  setFilter(key, value): void {
    this.options[key] = value;
    setTimeout(() => {
      this.fetchSummaryData(this.selectedSiteId);      
    }, 500);
  }

  setSelectedSiteFnc(siteId, siteArray): void {
    this.selectedSiteData = siteArray.find(x => x._id === siteId);
  }

  counter(i: number) {
    return new Array(i);
  }

  getTotalHours(hoursArray) {
    let totalHours = 0;
    let totalMinutes = 0;
    hoursArray.forEach((item) => {
      totalHours += Number(item.runningHours);
      totalMinutes += Number(item.runningMinutes);
    });
    if(totalMinutes > 60 && totalMinutes < 120) {
      totalHours = totalHours + 1;
      totalMinutes = totalMinutes - 60;
    } else if(totalMinutes > 120 && totalMinutes < 180){
      totalHours = totalHours + 2;
      totalMinutes = totalMinutes - 120;
    } else if(totalMinutes > 180 && totalMinutes < 240){
      totalHours = totalHours + 3;
      totalMinutes = totalMinutes - 180;
    } else if(totalMinutes > 240 && totalMinutes < 300){
      totalHours = totalHours + 4;
      totalMinutes = totalMinutes - 240;
    } else if(totalMinutes > 300 && totalMinutes < 360){
      totalHours = totalHours + 5;
      totalMinutes = totalMinutes - 300;
    } else if(totalMinutes > 360 && totalMinutes < 420){
      totalHours = totalHours + 6;
      totalMinutes = totalMinutes - 360;
    }
    console.log('hoursArray',totalHours,totalMinutes )
    console.log(totalHours +"."+totalMinutes);
  
    return (totalHours +"."+totalMinutes).toString();
  }

  // getDateRangeVal(optionsObj) {
  //   let dateString = '';
  //   if (optionsObj && optionsObj.date && optionsObj.date.fromDate) {
  //     dateString = this.formatDate(optionsObj.date.fromDate) + ' TO '+ this.formatDate(optionsObj.date.toDate);
  //   } 
  //   return dateString;
  // }

  // public formatDate(str): string {
  //   try {
  //     if (!this.isValidString(str)) {
  //       return '';
  //     }
  //     const dateVal = moment(str, 'DD/MM/YYYY').format(DATE_FORMATE);
  //     return dateVal.toUpperCase();
  //   } catch (err) {
  //     return str;
  //   }
  // }

  // private isValidString(str: any): boolean {
  //   return str !== null && str !== undefined && str !== 'null';
  // }  

  selectDateFrom(event){    
    this.dateFromVal = moment(event.target.value).format(DATE_FORMATE);
    this.options["fromDate"] = this.dateFromVal;
  }

  selectDateTo(event){
    this.dateToVal = moment(event.target.value).format(DATE_FORMATE);
    this.options["toDate"] = this.dateToVal;
  }
}
