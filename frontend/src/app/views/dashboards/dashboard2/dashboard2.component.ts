import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import {OwlOptions} from 'ngx-owl-carousel-o';
import { NgwWowService } from 'ngx-wow';
import * as am4maps from '@amcharts/amcharts4/maps';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styles: []
})
export class Dashboard2Component implements OnInit {
  constructor(private wowService: NgwWowService) {
    this.wowService.init();
  }
  data = [];
  statusClass = 'primary';
  lastDate = 0;
  TICKINTERVAL = 86400000;
  XAXISRANGE: any;

  optionsData: AnimationOptions = {
    path: '/assets/images/small/data1.json'
  };
  public chart1 = {
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
    series: [{
      name: 'Session Duration',
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
    },
      {
        name: 'Page Views',
        data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
      },
      {
        name: 'Total Visits',
        data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
      }
    ],
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
      categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
        '10 Jan', '11 Jan', '12 Jan'
      ]
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    tooltip: {
      y: [{
        title: {
          // tslint:disable-next-line:only-arrow-functions
          formatter(val) {
            return val + ' (mins)';
          }
        }
      }, {
        title: {
          // tslint:disable-next-line:only-arrow-functions
          formatter(val) {
            return val + ' per session';
          }
        }
      }, {
        title: {
          formatter(val) {
            return val;
          }
        }
      }]
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  };
  public chart2 = {
    chart: {
      height: 112,
      type: 'area',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      group: 'sparklines',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0,
      }
    },
    series: [{
      data: this.data
    }],
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime',
      range: this.XAXISRANGE,
    },
    yaxis: {
      max: 100
    },
    legend: {
      show: false
    },
  };

  public dash1MultiBarChart = {
    chart: {
      height: 268,
      type: 'area',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      group: 'sparklines',
    },
    colors: ['#0084ff', '#00ca00', '#ffd400' ],
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [3, 2, 3],
      curve: 'straight',
    },
    series: [{
      name: 'Session Duration',
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
    },
      {
        name: 'Page Views',
        data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
      },
      {
        name: 'Total Visits',
        data: [87, 57, 74, 30, 75, 38, 62, 47, 82, 56, 45, 47]
      }
    ],
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
      categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
        '10 Jan', '11 Jan', '12 Jan'
      ],
      labels: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    tooltip: {
      y: [{
        title: {
          formatter(val) {
            return val + ' (mins)';
          }
        }
      }, {
        title: {
          formatter(val) {
            return val + ' per session';
          }
        }
      }, {
        title: {
          formatter(val) {
            return val;
          }
        }
      }]
    },
    grid: {
      borderColor: '#f1f1f1',
    }
  };
  public dash1DonetChart = {
    chart: {
      height: 235,
      type: 'donut',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '55%'
        }
      }
    },
    series: [44, 55, 41],
    colors: ['#00ca00', '#e64141' , '#0084ff'],
    labels: ['Server1', 'Server2', 'Server3'],
    legend: {
      position: 'bottom'
    }
  };

  public serverData = [
    {
      id: '0879985',
      since_date: '26/12/2019',
      reboot_date:  '30/12/2019',
      status: 'Running',
      location: 'Victoria 8007 Australia',
      progress: 90
    },
    {
      id: '00879984',
      since_date: '23/12/2019',
      reboot_date:  '27/12/2019',
      status: 'Starting',
      location: 'Athens 2745 Greece',
      progress: 70
    },
    {
      id: '00879983',
      since_date: '18/12/2019',
      reboot_date:  '21/12/2019',
      status: 'Stopped',
      location: 'Victoria 8007 Australia',
      progress: 48
    },
    {
      id: '00879982',
      since_date: '26/12/2019',
      reboot_date:  '30/12/2019',
      status: 'Maintenance',
      location: 'Victoria 8007 Australia',
      progress: 70
    },
    {
      id: '000879982',
      since_date: '14/12/2019',
      reboot_date:  '20/12/2019',
      status: 'Working',
      location: 'Delhi 0014 India',
      progress: 90
    },
    {
      id: '00879981',
      since_date: '10/12/2019',
      reboot_date:  '18/12/2019',
      status: 'Running',
      location: 'Alabama 2741 USA',
      progress: 90
    },
  ];

  paymentTypeOptions: OwlOptions =  {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      }
    },
    nav: true
  };

  paymentTypeSlider = [
    {
      id: 1,
      image: '/assets/images/booking/03.png',
    },
    {
      id: 2,
      image: '/assets/images/booking/03.png',
    },
    {
      id: 3,
      image: '/assets/images/booking/03.png',
    }
  ];
  public getServerStatus($msg) {
    $msg = $msg.toLowerCase();
    if ($msg === 'starting') {
      this.statusClass = 'warning';
    } else if ($msg === 'stopped') {
      this.statusClass = 'danger';
    } else if ($msg === 'maintenance') {
      this.statusClass = 'primary';
    } else {
      this.statusClass = 'success';
    }
    return  this.statusClass;
  }

  ngOnInit() {
    this.getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {min: 10, max: 90});
    this.resetData();
  }
  getDayWiseTimeSeries = function(baseval, count, yrange) {
    let i = 0;
    while (i < count) {
      const x = baseval;
      const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      this.data.push({
        x,
        y
      });
      this.lastDate = baseval;
      baseval += this.TICKINTERVAL;
      i++;
    }
  };

  resetData = function() {
    this.data = this.data.slice(this.data.length - 10, this.data.length);
  };


}
