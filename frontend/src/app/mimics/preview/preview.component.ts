import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

import { ActivatedRoute, Router } from "@angular/router";
import { MimicService } from "../../services/mimic/mimic.service";
import * as $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';

@Component({
  selector: 'app-mimic',
  templateUrl: './preview.component.html',
  styleUrls: []

})
export class PreviewComponent implements OnInit {

  mimicId: any;

  constructor(public apiService: ApiService,
    private router: Router,
    private mimicService: MimicService,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.mimicId = params.id;
      this.getMimicDataById();
    });
  }
  
  getMimicDataById(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getMimicDetail(dataObj).subscribe(res => {  
      if (res.code === 200) {
        if (res.result[0] && res.result[0].mimic_data.length > 0) {
          let mimic_data = res.result[0].mimic_data;
          this.displayExistingMimic(mimic_data);
        }
      }
    });
  }

  ngOnInit() {
    var images =  JSON.parse(localStorage.getItem('currentMimic'));
    this.displayExistingMimic(images);
  }

  displayExistingMimic(mimic_data) {
    $('.iq-sidebar').remove();
    $('.iq-top-navbar').remove();
    $('.content-page').css({'padding':0,'margin':0});
    let html='';
    mimic_data.forEach(element => {
      html+='<div class="drag" style="'+element.style+'">';
      html+='<img src="'+element.name+'" width="100%" height="100%">';
      html+='</div>';      
    });
    $('#droppable').html(html);
  }
}
