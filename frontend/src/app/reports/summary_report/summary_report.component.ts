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
import { DatePipe } from '@angular/common';
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
  storedSites: any;
  permittedSitesArr: any;
  selectedTimeInterval: any = "";
  pumpHrsFlag: boolean = false;
  flowRateFlag: boolean = false;
  chartDraw: boolean = false;

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


  /*----------------- Chart-11 ----------------*/
  chart11: any = {
    chart: {
      height: 407,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [5, 7, 5],
      curve: 'straight',
      dashArray: [0, 8, 5]
    },
    series: [{name: "Default", data: []}],
    legend: {
      show: false
    },
    markers: {
      size: 0,

      hover: {
        sizeOffset: 6
      }
    },
    xaxis: {
      categories: ['']
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    tooltip: {
      y: []
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  }


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
    
  }

  permittedSitesFnc(sitesAvail) {
    this.permittedSitesArr = sitesAvail.map(function (value) {
      return value._id;
    });
  }

  fetchMimics() {
    let dataObj = { permittedSites: this.permittedSitesArr }
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

  changeIntervalSelection(event) {
    if (event.target.value && event.target.value != "") {
      this.selectedTimeInterval = event.target.value;
    } else {
      this.selectedTimeInterval = "";
    }
    this.fetchSummaryData(this.selectedSiteId);
    //$('#mytable').hide();
  }


  changeMimicType(mimicVal) {
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

  pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
    }
  }

  searchData() {
    this.options.search = this.searchString;
    this.fetchSummaryData(this.selectedSiteId);
  }

  fetchSummaryData(selectedSiteIdVal) {
    $('#mytable').show();
    let dataObj = {
      options: this.options,
      selectedSite: selectedSiteIdVal,
      timeInterval: this.selectedTimeInterval
    }
    this.mimicService.fetchSummaryDataFnc(dataObj).subscribe(res => {
      if (res.code === 200) {
        const reultantArr = res.result.map(element => {
          element.date = moment(element.date, 'DD-MM-YYYY').format('MM-DD-YYYY');
          return element;
        });
        this.dataArr = reultantArr;
        this.plotChart(this.dataArr)
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
    if (totalMinutes > 60 && totalMinutes < 120) {
      totalHours = totalHours + 1;
      totalMinutes = totalMinutes - 60;
    } else if (totalMinutes > 120 && totalMinutes < 180) {
      totalHours = totalHours + 2;
      totalMinutes = totalMinutes - 120;
    } else if (totalMinutes > 180 && totalMinutes < 240) {
      totalHours = totalHours + 3;
      totalMinutes = totalMinutes - 180;
    } else if (totalMinutes > 240 && totalMinutes < 300) {
      totalHours = totalHours + 4;
      totalMinutes = totalMinutes - 240;
    } else if (totalMinutes > 300 && totalMinutes < 360) {
      totalHours = totalHours + 5;
      totalMinutes = totalMinutes - 300;
    } else if (totalMinutes > 360 && totalMinutes < 420) {
      totalHours = totalHours + 6;
      totalMinutes = totalMinutes - 360;
    }

    return (totalHours + "." + totalMinutes).toString();
  }
  getFormattedDate(date) {
    const newDate = date.split('/')[1] + '/' + date.split('/')[0] + '/' + date.split('/')[2];
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(newDate, 'MMMM d y');
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

  selectDateFrom(event) {
    this.dateFromVal = moment(event.target.value).format(DATE_FORMATE);
    var dateObj = new Date(this.dateFromVal);
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    this.options["fromDate"] = this.dateFromVal; //year+'-'+month+'-'+(day+1);
    // this.options["fromYear"] = year;
    // this.options["fromMonth"] = month;
    // this.options["fromDay"] = day+1;
  }

  selectDateTo(event) {
    this.dateToVal = moment(event.target.value).format(DATE_FORMATE);
    var dateObj = new Date(this.dateToVal);
    var tomonth = dateObj.getUTCMonth() + 1; //months from 1-12
    var today = dateObj.getUTCDate();
    var toyear = dateObj.getUTCFullYear();
    this.options["toDate"] = this.dateToVal; //toyear+'-'+tomonth+'-'+(today+1);
    // this.options["toYear"] = toyear;
    // this.options["toMonth"] = tomonth;
    // this.options["toDay"] = today+1;
  }


  plotChart(resultArr): void {
    resultArr = resultArr.length > 0 && resultArr.sort(function(a,b){
      return new Date(a.date).valueOf() - new Date(b.date).valueOf()
    })
    let xaxisCatArr:any = resultArr.length > 0 && resultArr.map((a)=>{
      return moment(a.date).format("DD MMM");
    });
    let arrPumpFinal: any = [];
    resultArr.length > 0 && resultArr[0].pumpData && resultArr[0].pumpData.forEach((pmpDt, k)=>{
      arrPumpFinal.push(this.getPumpIndexedArray(resultArr, k));
    });
    let valuesPumpArray = []
    arrPumpFinal.length > 0 && arrPumpFinal.forEach((element, l) => {
      valuesPumpArray.push({
        name: "Pump "+(l+1),
        data: element
      })
    });
    this.chart11 = {
      chart: {
        id: "summaryChart",
        height: 407,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: true
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      series: valuesPumpArray,
      legend: {
        show: false
      },
      markers: {
        size: 0,  
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: xaxisCatArr
      },
      yaxis: {
        labels: {
          show: true
        }
      },
      tooltip: {
        y: [{
          title: {
            formatter: function (val) {
              return val + " hrs"
            }
          }
        }, {
          title: {
            formatter: function (val) {
              return val + " hrs"
            }
          }
        }, {
          title: {
            formatter: function (val) {
              return val + " hrs";
            }
          }
        }]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }
    if(!this.chartDraw){
      var chart_3 = new ApexCharts(
        document.querySelector("#chart-11"),
        this.chart11
      );
      chart_3.render();
      this.chartDraw = true;
    } else {
      ApexCharts.exec("summaryChart", "updateOptions", {
        series: valuesPumpArray,
        xaxis: {
          categories: xaxisCatArr
        }
      });
    }
  }

  getPumpIndexedArray(resultArr, k){
    let arrayVal = [];
    resultArr.length > 0 && resultArr.forEach((pumpArr)=>{
      pumpArr.pumpData.forEach((pmpDt, m)=>{
        if (k == m) {            
            arrayVal.push(pumpArr.pumpData[k].runningHours);
        }
      });
    });
    return arrayVal;
  }
  
}
