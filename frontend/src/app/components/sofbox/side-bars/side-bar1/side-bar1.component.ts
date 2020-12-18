import { Component, OnInit } from '@angular/core';
import {MenuItem} from '../../../../models/menu-item';
import {ApiService} from '../../../../services/api.service';
import SideBar from '../../../../fake-api/json/SideBar.json';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';

import $ from 'jquery';

@Component({
  selector: 'app-side-bar1',
  templateUrl: './side-bar1.component.html',
  styleUrls: [],
})
export class SideBar1Component implements OnInit {

  menuItems: MenuItem[] = SideBar.data;
  listClass =  'iq-menu';
  display: false;
  setDefaultEvent: any;

  constructor(public apiService: ApiService, private router: Router,
    private toastr: ToastrService) { 
  }

  ngOnInit() {
    this.getMenuItems();
  }

  getMenuItems() {
    if(this.setDefaultEvent) {
      this.menuItems.forEach(element => {
        if (element.title == "Schedule") {
          element.link = "/events/event_list/schedule/" + this.setDefaultEvent
        }
      });
    }
  }  

  activeLink(item) {
    let active = false;
    if (item.children !== undefined) {
      item.children.filter((person) => {
        if (person.link === window.location.pathname) {
          active = true;
        }
      });
    }
    return active;
  }
  ngAfterContentInit() {
    setTimeout(() => {
      /*$(document).find('.iq-menu a.active')
        .closest('.iq-submenu').addClass('menu-open');
      $(document).find('.iq-menu a.active')
        .parentsUntil('li').addClass('menu-open active');*/
    }, 200);
  }

  routeToDestination(setlink, setTitle){
    console.log(".setlink....", setTitle);
    // if(setTitle == "Users" || setTitle == "Subscriptions" || setTitle == "Home") {
      this.router.navigate([setlink]);
    // } else {
    //   this.toastr.error("Module is under development, Coming Soon!");
    // }
    // if(setDefaultEventVal && setDefaultEventVal != null && setDefaultEventVal != "null") {
    //   this.router.navigate([setlink]);
    // }
    // else {
    //   if(setTitle == "My event" || setTitle == "Home") {
    //     this.router.navigate([setlink]);
    //   } else {
    //     this.toastr.error("Please select default event or add one event atleast (if not exist)");
    //   }
    // }
  }

}
