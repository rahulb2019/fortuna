import { Component, OnInit } from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {NgwWowService} from 'ngx-wow';
import * as mapboxgl from 'mapbox-gl';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styles: []
})
export class TrackingComponent implements OnInit {

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
  public tranckingData = [
    {
      name: 'D-NO-1',
      image: 'assets/images/user/1.jpg',
      status: 1,
      isActive: false,
      item: [
        {
          image : 'assets/images/page-img/tag_blue.svg',
          name : 'Flipkart',
          item_counts : 10,
        },
        {
          image : 'assets/images/page-img/tag_red.svg',
          name : 'Zomato',
          item_counts : 2,
        },
        {
          image : 'assets/images/page-img/man.svg',
          name : 'Warehouse',
        }
      ],
      delivered: '2HR'
    },
    {
      name: 'D-NO-2',
      image: 'assets/images/user/1.jpg',
      status: 1,
      isActive: true,
      item: [
        {
          image : 'assets/images/page-img/tag_blue.svg',
          name : 'Flipkart',
          item_counts : 10,
        },
        {
          image : 'assets/images/page-img/tag_red.svg',
          name : 'Zomato',
          item_counts : 2,
        },
        {
          image : 'assets/images/page-img/man.svg',
          name : 'Warehouse',
        }
      ],
      delivered: true
    },
    {
      name: 'D-NO-3',
      image: 'assets/images/user/1.jpg',
      status: 1,
      isActive: false,
      item: [
        {
          image : 'assets/images/page-img/tag_blue.svg',
          name : 'Flipkart',
          item_counts : 10,
        },
        {
          image : 'assets/images/page-img/tag_red.svg',
          name : 'Zomato',
          item_counts : 2,
        },
        {
          image : 'assets/images/page-img/man.svg',
          name : 'Warehouse',
        }
      ],
      delivered: '2HR'
    },
    {
      name: 'D-NO-4',
      image: 'assets/images/user/1.jpg',
      status: 1,
      isActive: false,
      item: [
        {
          image : 'assets/images/page-img/tag_blue.svg',
          name : 'Flipkart',
          item_counts : 10,
        },
        {
          image : 'assets/images/page-img/tag_red.svg',
          name : 'Zomato',
          item_counts : 2,
        },
        {
          image : 'assets/images/page-img/man.svg',
          name : 'Warehouse',
        }
      ],
      delivered: '2HR'
    },
    {
      name: 'D-NO-5',
      image: 'assets/images/user/1.jpg',
      status: 1,
      isActive: false,
      item: [
        {
          image : 'assets/images/page-img/tag_blue.svg',
          name : 'Flipkart',
          item_counts : 10,
        },
        {
          image : 'assets/images/page-img/tag_red.svg',
          name : 'Zomato',
          item_counts : 2,
        },
        {
          image : 'assets/images/page-img/man.svg',
          name : 'Warehouse',
        }
      ],
      delivered: '2HR'
    },
    {
      name: 'D-NO-6',
      image: 'assets/images/user/1.jpg',
      status: 1,
      isActive: false,
      item: [
        {
          image : 'assets/images/page-img/tag_blue.svg',
          name : 'Flipkart',
          item_counts : 10,
        },
        {
          image : 'assets/images/page-img/tag_red.svg',
          name : 'Zomato',
          item_counts : 2,
        },
        {
          image : 'assets/images/page-img/man.svg',
          name : 'Warehouse',
        }
      ],
      delivered: '2HR'
    },
    {
      name: 'D-NO-7',
      image: 'assets/images/user/1.jpg',
      status: 1,
      isActive: false,
      item: [
        {
          image : 'assets/images/page-img/tag_blue.svg',
          name : 'Flipkart',
          item_counts : 10,
        },
        {
          image : 'assets/images/page-img/tag_red.svg',
          name : 'Zomato',
          item_counts : 2,
        },
        {
          image : 'assets/images/page-img/man.svg',
          name : 'Warehouse',
        }
      ],
      delivered: '2HR'
    },
    {
      name: 'D-NO-8',
      image: 'assets/images/user/1.jpg',
      status: 1,
      isActive: false,
      item: [
        {
          image : 'assets/images/page-img/tag_blue.svg',
          name : 'Flipkart',
          item_counts : 10,
        },
        {
          image : 'assets/images/page-img/tag_red.svg',
          name : 'Zomato',
          item_counts : 2,
        },
        {
          image : 'assets/images/page-img/man.svg',
          name : 'Warehouse',
        }
      ],
      delivered: '2HR'
    },
  ];
  public progressBardata = [
    {
      name : 'Excellent',
      type : 'info',
      points : 2400,
      percent : 60,
    },
    {
      name : 'Very Good',
      type : 'primary',
      points : 1200,
      percent : 20,
    },
    {
      name : 'Good',
      type : 'info',
      points : 240,
      percent : 10,
    },
    {
      name : 'Fair',
      type : 'warning',
      points : 80,
      percent : 40,
    },
    {
      name : 'Poor',
      type : 'secondory',
      points : 50,
      percent : 10,
    },
    {
      name : 'Very Poor',
      type : 'danger',
      points : 50,
      percent : 10,
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

  map: mapboxgl.Map;

  ngOnInit() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: environment.mapbox.mapStyle,
      center: [-82.0036, 43.6441],
      zoom: 4
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());


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
  
  public getOrderStatus($msg) {
    $msg = $msg.toLowerCase();
    if($msg == 'pending') {
      this.statusClass = 'warning';
    } else if ($msg == 'canceled') {
      this.statusClass = 'danger';
    }else if ($msg == 'working') {
      this.statusClass = 'primary';
    } else {
      this.statusClass = 'success';
    }
    return  this.statusClass;
  }

}
