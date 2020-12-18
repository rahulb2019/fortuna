import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';
import jQuery from 'jquery';
import { AdminService } from "../../../../services/admin/admin.service";
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-nav-bar1',
  templateUrl: './nav-bar1.component.html',
  styleUrls: []
})
export class NavBar1Component implements OnInit {

  eventDDForm: FormGroup;

  breadCrumbItems = [
    {
      isActive: false,
      label: 'Dashboard',
      link: '/dashboard'
    },
    {
      isActive: true,
      label: 'Dashboard',
      link: '/dashboard'
    }
  ];

  messagesList = [
    {
      title: 'Nik Emma Watson',
      image: '/assets/images/user/01.jpg',
      link: '#',
      date_format: '13 Apr'
    },
    {
      title: 'Lorem Ipsum Watson',
      image: '/assets/images/user/02.jpg',
      link: '#',
      date_format: '20 Jun'
    },
    {
      title: 'Why do we use it?',
      image: '/assets/images/user/03.jpg',
      link: '#',
      date_format: '08 July'
    },
    {
      title: 'Variations Passages',
      image: '/assets/images/user/04.jpg',
      link: '#',
      date_format: '12 Sep'
    },
    {
      title: 'Lorem Ipsum generators',
      image: '/assets/images/user/05.jpg',
      link: '#',
      date_format: '5 Dec'
    }
  ];


  notificationList = [
    {
      title: 'New Order Received',
      sub_title: 'Lorem is simply',
      image: null,
      link: '#',
      date_format: '23 hrs ago'
    },
    {
      title: 'Emma Watson Nik',
      sub_title: '95 MB',
      image: '/assets/images/user/01.jpg',
      link: '#',
      date_format: 'Just Now'
    },
    {
      title: 'New customer is join',
      sub_title: 'John Nik',
      image: '/assets/images/user/02.jpg',
      link: '#',
      date_format: '5 days ago'
    },
    {
      title: 'Updates Available',
      sub_title: '120 MB',
      image: '/assets/images/small/jpg.svg',
      link: '#',
      date_format: 'Just Now'
    }
  ];

  countTicket = 0;
  userDetails: any;
  eventsArr: any = [];
  setDefaultEvent: any;

  constructor(private store: Store<any>, 
    private router: Router, 
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService) { 
      //this.userDetails = JSON.parse(sessionStorage.admin_login).admindata;
      // this.createEventFormFnc();
    }

  ngOnInit() {
    this.store.subscribe(state => (this.countTicket = state.ticketBooking.ticketCount));
  }  

  clickPaymentShow(countTicketBooking) {
      if (countTicketBooking > 0) {
        jQuery('.iq-sidebar-right-menu').addClass('film-side');
      }
  }

  logout(){
    this.adminService.logout();
  }

}
