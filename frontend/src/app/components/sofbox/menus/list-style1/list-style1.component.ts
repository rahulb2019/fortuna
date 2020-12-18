import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {MenuItem} from '../../../../models/menu-item';
import $ from 'jquery';

@Component({
  selector: 'app-list-style1',
  templateUrl: './list-style1.component.html',
  styles: []
})
export class ListStyle1Component implements OnInit, AfterContentInit {

  @Input() listClass =  'iq-menu';
  @Input() listItems: MenuItem[];
  @Input() display: false;

  constructor() { }

  ngOnInit() {
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
}
