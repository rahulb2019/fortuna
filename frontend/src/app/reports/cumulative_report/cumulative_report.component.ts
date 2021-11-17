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
import { objectEach } from 'highcharts';
const DATE_FORMATE = 'DD/MM/YYYY';

@Component({
  selector: 'app-cumulative-report',
  templateUrl: './cumulative_report.component.html',
  styleUrls: []
})
export class CumulativeReportComponent implements OnInit {

  dropdownSettings: IDropdownSettings;
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
  selectedTimeInterval: any = "";
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
  chartFlow: any = {};
  chartLevel: any = {};
  chartMeter: any = {};
  chartChlorine: any = {};
  chartTurbidity: any = {};
  chartTDS: any = {};
  chartPH: any = {};
  chartPressureTransmeter: any = {};
  chartDepth: any = {};
  chartVibration: any = {};
  chartTemperature: any = {};
  arrChlorineFinal: any = {};
  arrTurbidityFinal: any = {};
  arrTDSFinal: any = {};
  arrPHFinal: any = {};
  arrPTFinal: any = {};
  arrDepthFinal: any = {};
  arrVibrationFinal: any = {};
  arrTemperatureFinal: any = {};
  arrFlowFinal: any = {};
  arrLevelFinal: any = {};
  arrMeterFinal: any = [];

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

  changeIntervalSelection(event) {
    if (event.target.value && event.target.value != "") {
      this.selectedTimeInterval = event.target.value;
    } else {
      this.selectedTimeInterval = "";
    }
    this.fetchCumulativeData(this.selectedSiteId);
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
    this.fetchCumulativeData(this.selectedSiteId);
  }

  fetchCumulativeData(selectedSiteIdVal) {
    $('#mytable').show();
    let dataObj = {
      options: this.options,
      selectedSite: selectedSiteIdVal,
      timeInterval: this.selectedTimeInterval
    }
    this.mimicService.fetchCumulativeData(dataObj).subscribe(res => {
      if (res.code === 200) {
        this.dataArr = res.result;
        const currentEl = this;
        this.dataArr[0].pumpData.map(function (val, index) {
          val.map(function (innerVal) {
            Object.keys(innerVal).forEach(function eachKey(keyName) {
              const name = `Pump ${index + 1} - ${keyName}`;
              currentEl.tagsArr.push({ 'id': currentEl.convertToSlug(name), name });
            });
          })
        })
        this.dataArr[0].meterData.map(function (val, index) {
          Object.keys(val).forEach(function eachKey(keyName) {
            const name = `Meter ${index + 1} - ${keyName}`;
            currentEl.tagsArr.push({ 'id': currentEl.convertToSlug(name), name });
          });
        })
        currentEl.tagsArr.push({ 'id': currentEl.convertToSlug(`Flow Meter`), name: `Flow Meter` });
        currentEl.tagsArr.push({ 'id': currentEl.convertToSlug(`Level Sensor`), name: `Level Sensor` });
        currentEl.selectedTags = currentEl.tagsArr;
        this.plotChart(this.dataArr);
      }
      else {
        this.toastr.error(res.message);
      }
    });
  }
  convertToSlug(text) {
    return text.toLowerCase().replace(/ /g, '').replace(/[^\w-]+/g, '');
  }
  changeTagSelection(event) {
    const selectedTags = event.target.value;
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

  getPumpDataLength(objPump) {
    return Object.keys(objPump).length;
  }

  getMeterDataLength(objMeter) {
    return Object.keys(objMeter).length;
  }

  selectDateFrom(event) {
    this.dateFromVal = moment(event.target.value).format(DATE_FORMATE);
    this.options["fromDate"] = this.dateFromVal;
  }

  selectDateTo(event) {
    this.dateToVal = moment(event.target.value).format(DATE_FORMATE);
    this.options["toDate"] = this.dateToVal;
  }

  selectTimeFrom(event) {
    this.timeFromVal = event.target.value;
    this.options["fromTime"] = this.timeFromVal;
  }

  selectTimeTo(event) {
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
  hideShowColumn() {
    this.tagsArr.map(function (val) {
      $('.' + val.id).hide();
    });
    this.selectedTags.map(function (val) {
      $('.' + val.id).show();
    })
  }

  plotChart(resultArr): void {
    resultArr = resultArr.length > 0 && resultArr.sort(function (a, b) {
      return new Date(a.date).valueOf() - new Date(b.date).valueOf()
    })
    let xaxisCatArr: any = resultArr.length > 0 && resultArr.map((a) => {
      return moment(a.date, "DD/MM/YYYY").format("DD MMM") + " " + a.time;
    });
    this.arrFlowFinal = {
      name: "Flow Rate",
      data: []
    };
    this.arrLevelFinal = {
      name: "Level Sensor",
      data: []
    };
    let xCatArrayMeter = [];

    // :::: >>>> Calculating Graphs Data
    resultArr.length > 0 && resultArr.forEach((flowDt, k) => {
      flowDt.flowData.length > 0 ? this.arrFlowFinal.data.push(parseInt(flowDt.flowData[0])) : this.arrFlowFinal.data.push(0);
      flowDt.levelData.length > 0 ? this.arrLevelFinal.data.push(parseInt(flowDt.levelData[0])) : this.arrLevelFinal.data.push(0);
      if (flowDt.meterData.length > 0) xCatArrayMeter.push(moment(flowDt.date, "DD/MM/YYYY").format("DD MMM") + " " + flowDt.time);
      let obj = flowDt.meterData.length > 0 && flowDt.meterData[0];
      for (var key in obj) {
        const found = this.arrMeterFinal.some(el => el.name === key);
        if (!found && (key !== "Chlorine" && key !== "CL" && key !== "Turbidity" && key !== "TB" && key !== "TDS" && key !== "PH" && key !== "Pressure Transmeter" && key !== "PT" && key !== "Depth" && key !== "DS" && key !== "Vibration" && key !== "VB" && key !== "Temperature" && key !== "TEMP")) this.arrMeterFinal.push({ name: key, data: [] });

        let index = this.arrMeterFinal.findIndex(p => p.name == key);
        if (key !== "Chlorine" && key !== "CL" && key !== "Turbidity" && key !== "TB" && key !== "TDS" && key !== "PH" && key !== "Pressure Transmeter" && key !== "PT" && key !== "Depth" && key !== "DS" && key !== "Vibration" && key !== "VB" && key !== "Temperature" && key !== "TEMP") {
          this.arrMeterFinal[index].data.push(parseInt(obj[key]));
        }
      }
    });
//console.log(this.arrFlowFinal,this.arrLevelFinal,this.arrMeterFinal);
    this.plotFlowChart(this.arrFlowFinal, xaxisCatArr);
    this.plotLevelChart(this.arrLevelFinal, xaxisCatArr);
    this.plotMeterChart(this.arrMeterFinal, xCatArrayMeter);
    this.plotChlorineChart(resultArr);
    this.plotTurbidityChart(resultArr);
    this.plotTDSChart(resultArr);
    this.plotPHChart(resultArr);
    this.plotPressureTransmeterChart(resultArr);
    this.plotDepthChart(resultArr);
    this.plotVibrationChart(resultArr);
    this.plotTemperatureChart(resultArr);
    this.chartDraw = true;
  }

  plotFlowChart(seriesArr, xCategoriesArr) {
    this.chartFlow = {
      chart: {
        id: "chart_flow",
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      colors: ['#ffc107'],
      series: [seriesArr],
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      }
    }

    if (!this.chartDraw) {
      var chart_flow = new ApexCharts(
        document.querySelector("#apex-column-flow"),
        this.chartFlow
      );
      chart_flow.render();
      
    } else {
      ApexCharts.exec("apex-column-flow", "updateOptions", {
        series: seriesArr,
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

  plotLevelChart(seriesArrLevel, xCategoriesArr) {
    this.chartLevel = {
      chart: {
        id: "chart_level",
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      colors: ['#0084ff'],
      series: [seriesArrLevel],
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1

      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      }
    }

    if (!this.chartDraw) {
      var chart_level = new ApexCharts(
        document.querySelector("#apex-column-level"),
        this.chartLevel
      );
      chart_level.render();
      
    } else {
      ApexCharts.exec("apex-column-level", "updateOptions", {
        series: seriesArrLevel,
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

  plotMeterChart(seriesArrMeter, xCategoriesArr) {
    this.chartMeter = {
      chart: {
        id: "chart_meter",
        height: 350,
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
      legend: {
        show: false
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      series: seriesArrMeter,
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1

      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }

    if (!this.chartDraw) {
      var chart_meter = new ApexCharts(
        document.querySelector("#apex-column-meter"),
        this.chartMeter
      );
      chart_meter.render();
      
    } else {
      ApexCharts.exec("apex-column-meter", "updateOptions", {
        series: seriesArrMeter,
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

  plotChlorineChart(resultArr) {
    this.arrChlorineFinal = {
      name: "Chlorine",
      data: []
    };
    let xCategoriesArr = [];
    resultArr.length > 0 && resultArr.forEach((flowDt, k) => {
      let obj = flowDt.meterData.length > 0 && flowDt.meterData[0];
      for (var key in obj) {
        if (key === "Chlorine" || key === "CL") {
          xCategoriesArr.push(moment(flowDt.date, "DD/MM/YYYY").format("DD MMM") + " " + flowDt.time);
          this.arrChlorineFinal.data.push(parseInt(obj[key]));
        }
      }
    });
    this.chartChlorine = {
      chart: {
        id: "chart_chlorine",
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      colors: ['#e64141'],
      series: [this.arrChlorineFinal],
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1

      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }

    if (!this.chartDraw) {
      var chart_chlorine = new ApexCharts(
        document.querySelector("#apex-column-chlorine"),
        this.chartChlorine
      );
      chart_chlorine.render();
      
    } else {
      ApexCharts.exec("apex-column-chlorine", "updateOptions", {
        series: [this.arrChlorineFinal],
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

  plotTurbidityChart(resultArr) {
    this.arrTurbidityFinal = {
      name: "Turbidity",
      data: []
    };
    let xCategoriesArr = [];
    resultArr.length > 0 && resultArr.forEach((flowDt, k) => {
      let obj = flowDt.meterData.length > 0 && flowDt.meterData[0];
      for (var key in obj) {
        if (key === "Turbidity" || key === "TB") {
          xCategoriesArr.push(moment(flowDt.date, "DD/MM/YYYY").format("DD MMM") + " " + flowDt.time);
          this.arrTurbidityFinal.data.push(parseInt(obj[key]));
        }
      }
    });
    this.chartTurbidity = {
      chart: {
        id: "chart_turbidity",
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      colors: ['#e64141'],
      series: [this.arrTurbidityFinal],
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1

      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }

    if (!this.chartDraw) {
      var chart_turbidity = new ApexCharts(
        document.querySelector("#apex-column-turbidity"),
        this.chartTurbidity
      );
      chart_turbidity.render();
      
    } else {
      ApexCharts.exec("apex-column-turbidity", "updateOptions", {
        series: [this.arrTurbidityFinal],
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

  plotTDSChart(resultArr) {
    this.arrTDSFinal = {
      name: "TDS",
      data: []
    };
    let xCategoriesArr = [];
    resultArr.length > 0 && resultArr.forEach((flowDt, k) => {
      let obj = flowDt.meterData.length > 0 && flowDt.meterData[0];
      for (var key in obj) {
        if (key === "TDS") {
          xCategoriesArr.push(moment(flowDt.date, "DD/MM/YYYY").format("DD MMM") + " " + flowDt.time);
          this.arrTDSFinal.data.push(parseInt(obj[key]));
        }
      }
    });
    this.chartTDS = {
      chart: {
        id: "chart_tds",
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      colors: ['#0084ff'],
      series: [this.arrTDSFinal],
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1

      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }

    if (!this.chartDraw) {
      var chart_tds = new ApexCharts(
        document.querySelector("#apex-column-tds"),
        this.chartTDS
      );
      chart_tds.render();
      
    } else {
      ApexCharts.exec("apex-column-tds", "updateOptions", {
        series: [this.arrTDSFinal],
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

  plotPHChart(resultArr) {
    this.arrPHFinal = {
      name: "PH",
      data: []
    };
    let xCategoriesArr = [];
    resultArr.length > 0 && resultArr.forEach((flowDt, k) => {
      let obj = flowDt.meterData.length > 0 && flowDt.meterData[0];
      for (var key in obj) {
        if (key === "PH") {
          xCategoriesArr.push(moment(flowDt.date, "DD/MM/YYYY").format("DD MMM") + " " + flowDt.time);
          this.arrPHFinal.data.push(parseInt(obj[key]));
        }
      }
    });
    this.chartPH = {
      chart: {
        id: "chart_ph",
        height: 350,
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
      legend: {
        show: false
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      colors: ['#ffc107'],
      series: [this.arrPHFinal],
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1

      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }

    if (!this.chartDraw) {
      var chart_ph = new ApexCharts(
        document.querySelector("#apex-column-ph"),
        this.chartPH
      );
      chart_ph.render();
      
    } else {
      ApexCharts.exec("apex-column-ph", "updateOptions", {
        series: [this.arrPHFinal],
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

  plotPressureTransmeterChart(resultArr) {
    this.arrPTFinal = {
      name: "Pressure Transmeter",
      data: []
    };
    let xCategoriesArr = [];
    resultArr.length > 0 && resultArr.forEach((flowDt, k) => {
      let obj = flowDt.meterData.length > 0 && flowDt.meterData[0];
      for (var key in obj) {
        if (key === "PT" || key === "Pressure Transmeter") {
          xCategoriesArr.push(moment(flowDt.date, "DD/MM/YYYY").format("DD MMM") + " " + flowDt.time);
          this.arrPTFinal.data.push(parseInt(obj[key]));
        }
      }
    });
    this.chartPressureTransmeter = {
      chart: {
        id: "chart_press_transmeter",
        height: 350,
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
      legend: {
        show: false
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      colors: ['#ffc107'],
      series: [this.arrPTFinal],
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1

      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }

    if (!this.chartDraw) {
      var chart_press_transmeter = new ApexCharts(
        document.querySelector("#apex-column-press-transmeter"),
        this.chartPressureTransmeter
      );
      chart_press_transmeter.render();
      
    } else {
      ApexCharts.exec("apex-column-press-transmeter", "updateOptions", {
        series: [this.arrPTFinal],
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

  plotDepthChart(resultArr) {
    this.arrDepthFinal = {
      name: "Depth",
      data: []
    };
    let xCategoriesArr = [];
    resultArr.length > 0 && resultArr.forEach((flowDt, k) => {
      let obj = flowDt.meterData.length > 0 && flowDt.meterData[0];
      for (var key in obj) {
        if (key === "DS" || key === "Depth") {
          xCategoriesArr.push(moment(flowDt.date, "DD/MM/YYYY").format("DD MMM") + " " + flowDt.time);
          this.arrDepthFinal.data.push(parseInt(obj[key]));
        }
      }
    });
    this.chartDepth = {
      chart: {
        id: "chart_depth",
        height: 350,
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
      legend: {
        show: false
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      colors: ['#ffc107'],
      series: [this.arrDepthFinal],
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1

      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }

    if (!this.chartDraw) {
      var chart_depth = new ApexCharts(
        document.querySelector("#apex-column-depth"),
        this.chartDepth
      );
      chart_depth.render();
      
    } else {
      ApexCharts.exec("apex-column-depth", "updateOptions", {
        series: [this.arrDepthFinal],
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

  plotVibrationChart(resultArr) {
    this.arrVibrationFinal = {
      name: "Vibration",
      data: []
    };
    let xCategoriesArr = [];
    resultArr.length > 0 && resultArr.forEach((flowDt, k) => {
      let obj = flowDt.meterData.length > 0 && flowDt.meterData[0];
      for (var key in obj) {
        if (key === "VB" || key === "Vibration") {
          xCategoriesArr.push(moment(flowDt.date, "DD/MM/YYYY").format("DD MMM") + " " + flowDt.time);
          this.arrVibrationFinal.data.push(parseInt(obj[key]));
        }
      }
    });
    this.chartVibration = {
      chart: {
        id: "chart_vibration",
        height: 350,
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
      legend: {
        show: false
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      colors: ['#e64141'],
      series: [this.arrVibrationFinal],
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1

      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }

    if (!this.chartDraw) {
      var chart_vibration = new ApexCharts(
        document.querySelector("#apex-column-vibration"),
        this.chartVibration
      );
      chart_vibration.render();
      
    } else {
      ApexCharts.exec("apex-column-vibration", "updateOptions", {
        series: [this.arrVibrationFinal],
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

  plotTemperatureChart(resultArr) {
    this.arrTemperatureFinal = {
      name: "Temperature",
      data: []
    };
    let xCategoriesArr = [];
    resultArr.length > 0 && resultArr.forEach((flowDt, k) => {
      let obj = flowDt.meterData.length > 0 && flowDt.meterData[0];
      for (var key in obj) {
        if (key === "TEMP" || key === "Temperature") {
          xCategoriesArr.push(moment(flowDt.date, "DD/MM/YYYY").format("DD MMM") + " " + flowDt.time);
          this.arrTemperatureFinal.data.push(parseInt(obj[key]));
        }
      }
    });
    this.chartTemperature = {
      chart: {
        id: "chart_temp",
        height: 350,
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
      legend: {
        show: false
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      colors: ['#e64141'],
      series: [this.arrTemperatureFinal],
      xaxis: {
        categories: xCategoriesArr,
      },
      yaxis: {
      },
      fill: {
        opacity: 1

      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }

    if (!this.chartDraw) {
      var chart_temp = new ApexCharts(
        document.querySelector("#apex-column-temp"),
        this.chartTemperature
      );
      chart_temp.render();
      
    } else {
      ApexCharts.exec("apex-column-temp", "updateOptions", {
        series: [this.arrTemperatureFinal],
        xaxis: {
          categories: xCategoriesArr
        }
      });
    }
  }

}

