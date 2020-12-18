import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard1.component.html',
  styleUrls: []

})
export class Dashboard1Component implements OnInit {
  constructor(public apiService: ApiService) {
    this.usersData = [];
  }
  optionsData: AnimationOptions = {
    path: '/assets/images/small/data.json'
  };

  public chart1 = {
    chart: {
      height: 80,
      type: 'area',
      sparkline: {
        enabled: true
      },
      group: 'sparklines',

    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 3,
      curve: 'smooth'
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
      name: 'series1',
      data: [60, 15, 50, 30, 70]
    }, ],
    colors: ['#0084ff'],

    xaxis: {
      type: 'datetime',
      categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00'],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    }
  };
  public chart2 = {
    chart: {
      height: 80,
      type: 'area',
      sparkline: {
        enabled: true
      },
      group: 'sparklines',

    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 3,
      curve: 'smooth'
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
      name: 'series1',
      data: [70, 40, 60, 30, 60]
    }, ],
    colors: ['#ffd400'],

    xaxis: {
      type: 'datetime',
      categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00'],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    }
  };
  public chart3 = {
    chart: {
      height: 80,
      type: 'area',
      sparkline: {
        enabled: true
      },
      group: 'sparklines',

    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 3,
      curve: 'smooth'
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
      name: 'series1',
      data: [60, 40, 60, 40, 70]
    }, ],
    colors: ['#00ca00'],

    xaxis: {
      type: 'datetime',
      categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00'],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    }
  };
  public chart4 = {
    chart: {
      height: 80,
      type: 'area',
      sparkline: {
        enabled: true
      },
      group: 'sparklines',

    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 3,
      curve: 'smooth'
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
      name: 'series1',
      data: [75, 30, 60, 35, 60]
    }, ],
    colors: ['#e64141'],

    xaxis: {
      type: 'datetime',
      categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00'],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    }
  };
  public chart5 = {
    chart: {
      height: 200,
      type: 'line',
      sparkline: {
        enabled: true
      },
      stacked: false,
    },
    stroke: {
      width: [2, 3],
      curve: 'smooth',
      dashArray: [0, 5]
    },
    plotOptions: {
      bar: {
        columnWidth: '50%'
      }
    },
    colors: ['#00ca00', '#007bff'],
    series: [{
      name: 'Vine',
      type: 'area',
      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    }, {
      name: 'Dribbble',
      type: 'line',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
    }],
    fill: {
      opacity: [0.2, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      }
    },
    labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
    markers: {
      size: 0
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      min: 0
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter(y) {
          if (typeof y !== 'undefined') {
            return y.toFixed(0) + ' views';
          }
          return y;

        }
      }
    },
    legend: {
      labels: {
        useSeriesColors: true
      },
      markers: {
        customHTML: [
          function() {
            return '';
          },
          function() {
            return '';
          },
          function() {
            return '';
          }
        ]
      }
    }
  };
  public chart6 = {
    chart: {
      height: 400,
      type: 'bar',
      sparkline: {
        show: false

      },
      toolbar: {
        show: false
      },
    },
    colors: ['#0084ff', '#ffd400'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: false,
      width: 5,
      colors: ['#ffffff'],
    },
    series: [{
      name: 'Mobile',
      enabled: 'true',
      data: [44, 90, 90, 60, 115]
    }, {
      name: 'Desktop',
      data: [35, 80, 100, 70, 95]
    }],


    fill: {
      opacity: 1

    },
    tooltip: {
      y: {
        formatter: function(val) {
          return "$ " + val + " thousands"
        }
      }
    }
  };
  public sales = [
    {
      id: 1,
      title: 'Android Tablet',
      vendor: 'iqonicdesign',
      description: 'Android 10 supported tablet with best features.',
      sales:  '20,019',
      image:  'assets/images/page-img/01.jpg',
      rating: 5
    },
    {
      id: 2,
      title: 'Apple Watch',
      vendor: 'Apple',
      description: 'Latest model of apple watch for productivity.',
      sales:  '56,112',
      image:  'assets/images/page-img/02.jpg',
      rating: 5
    },
    {
      id: 3,
      title: 'I-Phone & I-Mac',
      vendor: 'qonic devices',
      description: 'Best ever combo package for work and personal use.',
      sales:  '9,895',
      image:  'assets/images/page-img/03.jpg',
      rating: 5
    }
  ];
  public supportTickets = [
    {
      id: 1,
      name: 'Nik Jordan',
      image:  'assets/images/user/01.jpg',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      date: '2 day ago',
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Lily Wozniak',
      image: 'assets/images/user/02.jpg',
      description: 'It is a long established fact that a reader will be distracted by the readable layout.',
      date: '2 day ago',
      status: 'Working'
    },
    {
      id: 3,
      name: 'Samuel Path',
      image:  'assets/images/user/03.jpg',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      date: '2 day ago',
      status: 'Open'
    },
    {
      id: 4,
      name: 'Mia Mai',
      image:  'assets/images/user/04.jpg',
      // tslint:disable-next-line:max-line-length
      description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      date: '2 day ago',
      status: 'Closed'
    }
  ];
  public orders = [
    {
      id: '0879985',
      date: '26/12/2019',
      delivery:  '30/12/2019',
      orderStatus: 'Moving',
      location: 'Victoria 8007 Australia',
      progress: 90
    },
    {
      id: '00879984',
      date: '23/12/2019',
      delivery:  '27/12/2019',
      orderStatus: 'Pending',
      location: 'Athens 2745 Greece',
      progress: 70
    },
    {
      id: '00879983',
      date: '18/12/2019',
      delivery:  '21/12/2019',
      orderStatus: 'Canceled',
      location: 'Victoria 8007 Australia',
      progress: 48
    },
    {
      id: '00879982',
      date: '26/12/2019',
      delivery:  '30/12/2019',
      orderStatus: 'Moving',
      location: 'Victoria 8007 Australia',
      progress: 70
    },
    {
      id: '000879982',
      date: '14/12/2019',
      delivery:  '20/12/2019',
      orderStatus: 'Working',
      location: 'Delhi 0014 India',
      progress: 90
    },
    {
      id: '00879981',
      date: '10/12/2019',
      delivery:  '18/12/2019',
      orderStatus: 'Moving',
      location: 'Alabama 2741 USA',
      progress: 90
    },
  ];
  usersData: any;
  statusClass = '';
  public getStatus($msg) {
    $msg = $msg.toLowerCase();
    // tslint:disable-next-line:triple-equals
    if ($msg == 'closed') {
      this.statusClass = 'danger';
      // tslint:disable-next-line:triple-equals
    } else if ($msg == 'working') {
      this.statusClass = 'warning';

      // tslint:disable-next-line:triple-equals
    } else if ($msg == 'Open') {
      this.statusClass = 'primary';
    } else {
      this.statusClass = 'success';
    }
    return  this.statusClass;
  }

  public getOrderStatus($msg) {
    $msg = $msg.toLowerCase();
    // tslint:disable-next-line:triple-equals
    if ($msg == 'pending') {
      this.statusClass = 'warning';
      // tslint:disable-next-line:triple-equals
    } else if ($msg == 'canceled') {
      this.statusClass = 'danger';

      // tslint:disable-next-line:triple-equals
    }else if ($msg == 'working') {
      this.statusClass = 'primary';
    } else {
      this.statusClass = 'success';
    }
    return  this.statusClass;
  }
  animationCreated(animationItem: AnimationItem): void {}

  ngOnInit() {}
}
