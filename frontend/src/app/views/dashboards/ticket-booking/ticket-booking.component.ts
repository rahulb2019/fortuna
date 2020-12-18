import { Component, OnInit } from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {Store} from '@ngrx/store';
import {CountTicketBooking, TicketBookingAction} from '../../../store/actions/ticket-booking.actions';
import jQuery from 'jquery';

@Component({
  selector: 'app-ticket-booking',
  templateUrl: './ticket-booking.component.html',
  styles: []
})
export class TicketBookingComponent implements OnInit {
  selected = [];

  optionsData: AnimationOptions = {
    path: '/assets/images/small/data2.json'
  };

  dates = [
    {date: 1, week: 'Sun'},
    {date: 2, week: 'Mon'},
    {date: 3, week: 'Tue'},
    {date: 4, week: 'Wed'},
    {date: 5, week: 'Thr'},
    {date: 6, week: 'Fri'},
    {date: 7, week: 'Sat'},
    {date: 8, week: 'Sun'},
    {date: 9, week: 'Mon'},
    {date: 10, week: 'Tue'},
    {date: 11, week: 'Wed'},
    {date: 12, week: 'Thr'}
  ];

  slideConfig = {
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 9,
    slidesToScroll: 1,
    focusOnSelect: true,
    responsive: [{
      breakpoint: 992,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '30',
        slidesToShow: 3
      }
    }, {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '15',
        slidesToShow: 1
      }
    }],
    nextArrow: '<a href="javascript:void(0);" class="ri-arrow-left-s-line left"></a>',
    prevArrow: '<a href="javascript:void(0);" class="ri-arrow-right-s-line right"></a>',
  };

  boxOfficesConfig = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, ' ', 10, 11, 12, 13, 14, 15, 16, 17, 18]
  };

  // tickets -> type -> 0 - Available, 1- Booked
  boxOfficeSeats = [
    {
      id: 1,
      class: 'd-inline-block w-100 pb-3',
      type: 'Platinum',
      price: 1000,
      price_format: '$200',
      tickets: {
        A: {
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
          13: 0,
          14: 0,
          15: 0,
        },
        B: {
          2: 0,
          3: 0,
          4: 1,
          5: 0,
          6: 0,
          7: 1,
          8: 0,
          9: 0,
          10: 1,
          11: 0,
          12: 0,
          13: 0,
          14: 1,
          15: 1,
          16: 1,
        },
        C: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
          13: 0,
          14: 0,
          15: 0,
          16: 0,
          17: 0,
          18: 0,
        }
      }
    },
    {
      id: 2,
      class: 'd-inline-block w-100 pb-3 border-top mt-4 pt-1',
      type: 'Gold',
      price: 500,
      price_format: '$200',
      tickets: {
        D: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
          13: 0,
          14: 0,
          15: 0,
          16: 0,
          17: 0,
          18: 0,
        },
        E: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
          13: 0,
          14: 0,
          15: 0,
          16: 0,
          17: 0,
          18: 0,
        },
        F: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 1,
          12: 1,
          13: 1,
          14: 1,
          15: 1,
          16: 1,
          17: 0,
          18: 0,
        }
      }
    },
    {
      id: 3,
      class: 'd-inline-block w-100 pb-3 border-top mt-4 pt-1',
      type: 'Sliver',
      price: 200,
      price_format: '$200',
      tickets: {
        G: {
          1: 0,
          2: 0,
          3: 0,
          4: 1,
          5: 0,
          6: 1,
          7: 1,
          8: 1,
          9: 1,
          10: 1,
          11: 1,
          12: 1,
          13: 1,
          14: 1,
          15: 1,
          16: 0,
          17: 0,
          18: 1,
        },
        H: {
          1: 0,
          2: 1,
          3: 1,
          4: 1,
          5: 1,
          6: 1,
          7: 1,
          8: 1,
          9: 1,
          10: 1,
          11: 1,
          12: 1,
          13: 1,
          14: 1,
          15: 1,
          16: 1,
          17: 1,
          18: 1,
        }
      }
    }
  ];

  countTicket = 0;

  constructor(private store: Store<any>) {
  }

  ngOnInit() {
  }

  selectedSeat(index, row, column) {

    let countTicketBooking = 0;
    if (this.selected[row + '-' + column] === undefined) {
      this.selected[row + '-' + column] = true;
      countTicketBooking = 1;
    } else {
      delete this.selected[row + '-' + column];
      countTicketBooking = -1;
    }

    this.store.subscribe(state => (this.countTicket = state.ticketBooking.ticketCount));
    this.store.dispatch(new CountTicketBooking({countTicket: this.countTicket + countTicketBooking}));
  }

  closePayment() {
    jQuery('.iq-sidebar-right-menu').removeClass('film-side');
  }

}
