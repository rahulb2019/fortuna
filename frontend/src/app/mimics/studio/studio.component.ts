import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MimicService } from "../../services/mimic/mimic.service";
import * as $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';

@Component({
  selector: 'app-mimic',
  templateUrl: './studio.component.html',
  styleUrls: []

})
export class StudioComponent implements OnInit {

  mimicId: any;
  selectedEle = null;

  constructor(public apiService: ApiService,
    private router: Router,
    private mimicService: MimicService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) {
    this.activatedRoute.params.subscribe(params => {
      this.mimicId = params.id;
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.mimicId = params.id;
      this.getMimicDataById();
    });
    this.manageEditor();
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

  displayExistingMimic(mimic_data) {
    let html='';
    mimic_data.forEach(element => {
      html+='<div class="drag small remove" style="'+element.style+'">';
      html+='<img src="'+element.name+'" width="100%" height="100%">';
      html+='<span class="xicon delete ui-icon ui-icon-close" title="Remove"></span>'
      html+='</div>';      
    });
    $('#droppable').html(html);
    $("#droppable .drag").each(function(){
      $(this).draggable({
        helper: 'original',
        cursor: 'move',
        tolerance: 'fit',
        scroll: false
      });
      $(this).resizable({
        handles: 'all',
        maxHeight: $('#droppable').height(),
        maxWidth: $('#droppable').width()
      }); 
      $('.delete').dblclick(function () {
        $(this).parent('div').remove();
      });
      $(this).click(function(){
        if($(this).hasClass("ui-resizable")){
          $(this).resizable('destroy');
        }
        else
        {
          $(this).resizable({
            handles: 'all',
            maxHeight: $('#droppable').height(),
            maxWidth: $('#droppable').width()
          }); 
        }
      })
    })
  }

  manageEditor() {
    //Make element draggable
    this.manageDraggable();
    this.manageDroppable();

  }

  manageDraggable(){
    $(".drag").draggable({
      helper: "clone",
      // appendTo: "#droppable",
      appendTo: "body",
      tolerance: 'fit',
      revert: true,
      cursor: 'move'
    });
  }

  manageDroppable() {
    $("#droppable").droppable({
      accept: '.drag',
      cursor: "move",
      activeClass: "drop-area",
      drop: function (e, ui) {
        if ($(ui.draggable)[0].id != "") {
          this.selectedEle = ui.helper.clone();
          ui.helper.remove();
          console.log(this.selectedEle);
          this.selectedEle.draggable({
            helper: 'original',
            cursor: 'move',
            //containment: '#droppable',
            tolerance: 'fit',
            scroll: false,
            drop: function (event, ui) {
              $(ui.draggable).remove();
            }
          });
          this.selectedEle.resizable({
            handles: 'all',
            maxHeight: $('#droppable').height(),
            maxWidth: $('#droppable').width()
          });
          this.selectedEle.addClass('remove');
          let el = $('<span class="xicon delete ui-icon ui-icon-close" title="Remove"></span>');
          $(el).insertAfter($(this.selectedEle.find('img')));
          this.selectedEle.appendTo('#droppable');
          $('.delete').dblclick(function () {
            $(this).parent('div').remove();
          });
          //set position according body to droppable
          let currentPos=this.selectedEle.offset();
          let droppablePos=$('#droppable').offset();
          this.selectedEle.css({
            top: currentPos.top-(droppablePos.top*2+2),
            left: currentPos.left-(droppablePos.left*2+2)
          });
        }
      }
    });
  }

  previewMimic() {    
    if ($('#droppable .drag').length == 0) this.toastr.error('You have not selected any images to show mimic preview');
    else {
        let images=[];
        $('#droppable').find('.drag').each(function(){
            let el=$(this);
            let imageAttr={'name':el.find('img').attr('src'),'style':el.attr('style')};
            images.push(imageAttr);
        });
        localStorage.setItem("currentMimic", JSON.stringify(images));
        window.open('/admin/mimics/preview/2', '_blank');
    }
  }

  saveMimic() {    
    if ($('#droppable .drag').length == 0) this.toastr.error('You have not selected any images to show mimic preview');
    else {
        let images = [];
        $('#droppable').find('.drag').each(function(){
            let el = $(this);
            let imageAttr = {'name':el.find('img').attr('src'),'style':el.attr('style')};
            images.push(imageAttr);
        });
        let dataArray = {
          id: this.mimicId,
          mimic_data: images
        };
        this.mimicService.updateMimicArch(dataArray).subscribe(res => {
          if (res.code == 200) {
                this.toastr.success(res.message);
                this.router.navigate(["/admin/mimics/mimic_list"]);
          } else {
            this.toastr.error(res.message);
          }
        });
    }
  }
}
