import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-iq-card',
  templateUrl: './iq-card.component.html',
  styles: []
})
export class IqCardComponent implements OnInit {
  @Input() item: any;
  @Input() field: any;
  @Input() b: any;
  @Input() ind: any;
  @Input() data: any;
  
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
    console.log("data-----", this.data);
  }

}
