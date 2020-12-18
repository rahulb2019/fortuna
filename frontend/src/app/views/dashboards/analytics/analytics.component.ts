import { Component, OnInit } from '@angular/core';
import {NgwWowService} from 'ngx-wow';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styles: []
})
export class AnalyticsComponent implements OnInit {

  constructor(private wowService: NgwWowService) {
    this.wowService.init();
  }

  public chart1 = {
    chart: {
      height: 308,
      type: 'line',
      toolbar: {
        show: false
      }
    },
    series: [{
      name: 'Website Blog',
      type: 'column',
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
    }, {
      name: 'Social Media',
      type: 'line',
      data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
    }],
    stroke: {
      width: [0, 4]
    },
    title: {
      show: false
    },
    legend: {
      show: false
    },
    // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
    colors: ['#0084ff', '#00ca00' ],
    xaxis: {
      labels: {
        show: false,
      },
      type: 'datetime'
    },
    yaxis: [{
      labels: {
        show: false,
      }
    }, {
      labels: {
        show: false,
      }
    }],
  };
  public chart2 = {
    chart: {
      height: 420,
      type: 'radialBar',
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 3,
        dashArray: 0,
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 10,
          size: '30%',
          background: 'transparent',
          image: undefined,
          imageWidth: 64,
          imageHeight: 64,
        },
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            // tslint:disable-next-line:only-arrow-functions
            formatter(w) {
              return 249;
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
    },
    colors: ['#0084ff', '#00ca00', '#ffd400' ],
    series: [44, 55, 67],
    stroke: {
      lineCap: 'round'
    },
    labels: [' Mobile', 'Desktop', 'Tablet', 'Watch'],
  };
  public chart3 = {
    chart: {
      height: 310,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#00ca00' , '#0084ff', '#e64141'],
    series: [{
      name: 'Income',
      type: 'column',
      data: [14, 2, 25, 15, 25, 28, 38, 46]
    }, {
      name: 'Cashflow',
      type: 'column',
      data: [11, 3, 31, 4, 41, 49, 65, 85]
    }, {
      name: 'Revenue',
      type: 'line',
      data: [20, 29, 37, 36, 44, 45, 50, 58]
    }],
    stroke: {
      width: [1, 1, 4]
    },
    xaxis: {
      categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
      labels: {
        show: false
      }
    },
    yaxis: {
      show: false
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: true,
        position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60
      },
    },
    legend: {
      show: false,
    }
  };
  public chart4 = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      hollow: {
        margin: 10,
        size: '30%',
        background: 'transparent',
        image: undefined,
        imageWidth: 64,
        imageHeight: 64,
      },
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '16px',
            color: undefined,
            offsetY: 120
          },
          value: {
            offsetY: 76,
            fontSize: '22px',
            color: undefined,
            formatter(val) {
              return val + '%';
            }
          }
        }
      }
    },
    fill: {
    },
    stroke: {
      dashArray: 5,
    },
    series: [67],
    labels: ['User traffic'],
    colors: ['#0084ff'],

  };
  public chart5 = {
    chart: {
      height: 150,
      type: 'bar',
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
      width: 15
    },
    series: [{
      name: 'series1',
      data: [70, 40, 60, 30, 60, 50,60]
    }, ],
    colors: ['#e5f2ff'],
    xaxis: {
      type: 'datetime',
      categories: ['2019-08-19T00:00:00', '2019-09-19T00:00:00', '2019-10-19T00:00:00', '2019-11-19T00:00:00', '2019-12-19T00:00:00', '2020-01-19T00:00:00'],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    }
  };

  public visitData = [
    {
      site_url: '/Home',
      visitor: '4,569',
      unique_user:  '340',
      color: 'success',
      bounce_rate: '46,53',
    },
    {
      site_url: '/Dashboard1/index.html',
      visitor: '3,985',
      unique_user:  '319',
      color: 'warning',
      bounce_rate: '46,53',
    },
    {
      site_url: '/Dashboard1/charts.html',
      visitor: '3,513',
      unique_user:  '294',
      color: 'warning',
      bounce_rate: '36,49',
    },
    {
      site_url: '/Dashboard1/tables.html',
      visitor: '2,050',
      unique_user:  '147',
      color: 'success',
      bounce_rate: '50,87',
    },
    {
      site_url: '/Dashboard1/profile.html',
      visitor: '1,795',
      unique_user:  '190',
      color: 'danger',
      bounce_rate: '46,53',
    },
    {
      site_url: '/Dashboard1/pricing.html',
      visitor: '8,395',
      unique_user:  '8190',
      color: 'danger',
      bounce_rate: '46,53',
    },
    {
      site_url: '/Dashboard1/Signup.html',
      visitor: '4,562',
      unique_user:  '4190',
      color: 'danger',
      bounce_rate: '46,53',
    }
  ];

    ngOnInit() {
  }

}
