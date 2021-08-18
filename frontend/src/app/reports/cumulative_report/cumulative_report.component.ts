import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import * as $ from 'jquery';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { MimicService } from "../../services/mimic/mimic.service";

import * as moment from 'moment';
const DATE_FORMATE = 'DD/MM/YYYY';

@Component({
  selector: 'app-cumulative-report',
  templateUrl: './cumulative_report.component.html',
  styleUrls: []
})
export class CumulativeReportComponent implements OnInit {

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
        this.fetchCumulativeData(this.selectedSiteId);
      }
      else {
        this.toastr.error(res.message);
      }
    });
  }

  changeSiteSelection(event) {
    this.selectedSiteId = event.target.value
    this.setSelectedSiteFnc(this.selectedSiteId, this.sitesArr);
    this.fetchCumulativeData(this.selectedSiteId);
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
    let dataObj = {
      options: this.options,
      selectedSite: selectedSiteIdVal
    }
    this.mimicService.fetchCumulativeData(dataObj).subscribe(res => {
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
      this.fetchCumulativeData(this.selectedSiteId);      
    }, 500);
  }

  setSelectedSiteFnc(siteId, siteArray): void {
    this.selectedSiteData = siteArray.find(x => x._id === siteId);
  }

  counter(i: number) {
    return new Array(i);
  }

  getTotalHours(hoursArray) {
    let total = 0;
  
    hoursArray.forEach((item) => {
      total += Number(item.runningHours);
    });
  
    return total;
  }

  getDateRangeVal(optionsObj) {
    let dateString = '';
    if (optionsObj && optionsObj.date && optionsObj.date.fromDate) {
      dateString = this.formatDate(optionsObj.date.fromDate) + ' TO '+ this.formatDate(optionsObj.date.toDate);
    } 
    return dateString;
  }

  public formatDate(str): string {
    try {
      if (!this.isValidString(str)) {
        return '';
      }
      const dateVal = moment(str, 'DD/MM/YYYY').format(DATE_FORMATE);
      return dateVal.toUpperCase();
    } catch (err) {
      return str;
    }
  }

  private isValidString(str: any): boolean {
    return str !== null && str !== undefined && str !== 'null';
  }  

  getPumpDataLength(objPump){
    return Object.keys(objPump).length;
  }  

  getMeterDataLength(objMeter){
    return Object.keys(objMeter).length;
  }
  
}
