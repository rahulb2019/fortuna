import { Component, OnInit } from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styles: []
})
export class PatientComponent implements OnInit {

  constructor() { }
  public chart1 = {
    chart: {
      height: 387,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      group: 'sparklines',
    },
    stroke: {
      width: [ 2, 3],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '20%'
      }
    },
    colors: ['#00ca00', '#0084ff' ],
    series: [ {
      name: 'Vine',
      type: 'area',
      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    }, {
      name: 'Dribbble',
      type: 'line',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
    }],
    fill: {
      opacity: [0.25, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100]
      }
    },
    labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],

    xaxis: {
      type: 'datetime',
      labels: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      labels: {
        show: false
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter(y) {
          if (typeof y !== 'undefined') {
            return  y.toFixed(0) + ' views';
          }
          return y;

        }
      }
    },
    legend: {
      show: false
    }
  };

  dietPlanOption: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 100,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  public calendarEvents = [
    {
      title: 'All Day Event',
      start: '2019-12-01'
    },
    {
      title: 'Long Event',
      start: '2019-12-07',
      end: '2019-12-10',
      color: 'purple' // override!
    },
    {
      groupId: '999',
      title: 'Repeating Event',
      start: '2019-12-09T16:00:00'
    },
    {
      groupId: '999',
      title: 'Repeating Event',
      start: '2019-12-16T16:00:00'
    },
    {
      title: 'Conference',
      start: '2019-12-11',
      end: '2019-12-13',
      color: 'purple' // override!
    },
    {
      title: 'Meeting',
      start: '2019-12-12T10:30:00',
      end: '2019-12-12T12:30:00',
      color: 'red'
    },
    {
      title: 'Lunch',
      start: '2019-12-12T12:00:00',
      color: 'green'
    },
    {
      title: 'Meeting',
      start: '2019-12-12T14:30:00'
    },
    {
      title: 'Birthday Party',
      start: '2020-01-02T07:00:00'
    },
    {
      title: 'Click for Google',
      url: 'http://google.com/',
      start: '2020-01-15'
    }
  ];

  public notifications = [
    {
      id: 1,
      name: 'Dr. Jay',
      image:  'assets/images/user/01.jpg',
      description: 'Lorem Ipsum is simply dummy text..',
      date: 'Yesterday'
    },
    {
      id: 2,
      name: 'Dr. Lilly',
      image:  'assets/images/user/02.jpg',
      description: 'Lorem Ipsum is simply dummy text..',
      date: 'Yesterday'
    },
    {
      id: 3,
      name: 'Dr. Steve ',
      image:  'assets/images/user/03.jpg',
      description: 'Lorem Ipsum is simply dummy text..',
      date: 'Yesterday'
    },
    {
      id: 3,
      name: 'Dr. Mia',
      image:  'assets/images/user/04.jpg',
      description: 'Lorem Ipsum is simply dummy text..',
      date: 'Yesterday'
    },
  ];

  ngOnInit() {
  }

}
