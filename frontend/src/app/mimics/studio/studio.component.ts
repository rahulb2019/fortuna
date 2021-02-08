import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MimicService } from "../../services/mimic/mimic.service";
import { Folder } from "../../config/constants";
import { environment } from "../../../environments/environment";
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
  
  categoriesArr: any = [];
  selectedImages: any = [];
  selectedCat: any;
  imageState: any = 0;
  imageUrl = environment.apiEndpoint + Folder._mimicImageOriginal;
  totalPumpsCount: number = 0
  selectedPumpsCount: number = 0
  selectedCategory: any = "";

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
    // this.manageEditor();
    this.getAllCategories();
  }
  anyfunction(){
    this.manageEditor();
  }

  getAllCategories() {
    let data = {}
    this.mimicService.getAllCategories(data).subscribe(res => {
      if (res.code === 200) {
        this.categoriesArr = res.result[0]
        this.selectedCat = this.categoriesArr[0]._id;
        this.getAllImages();
      }
      else {
        this.toastr.error(res.message); //alert error message
      }
    });
  }

  changeSelectedCategory(event){
    this.selectedCat = event.target.value ? event.target.value : this.selectedCat;
    this.getAllImages();
  }

  getAllImages(){
    let data = {
      site_image_category_id: this.selectedCat,
      state: 0
    }
    this.mimicService.getAllImages(data).subscribe(res => {
      if (res.code === 200) {
        this.selectedImages = res.result[0];
      }
      else {
        this.toastr.error(res.message); //alert error message
      }
    });
  }
  
  getMimicDataById(){
    let dataObj = {
      mimicId: this.mimicId
    }
    this.mimicService.getMimicDetail(dataObj).subscribe(res => {  
      if (res.code === 200) {
        if (res.result[0]) {
          let mimic_data = res.result[0].mimic_data;
          mimic_data && mimic_data.length > 0 && mimic_data.forEach(element => {
            if (element.category === "Pumps") {
              this.selectedPumpsCount++;
            }
          });
          this.totalPumpsCount = res.result[0].no_of_pumps;
          this.displayExistingMimic(mimic_data);
        }
      }
    });
  }

  displayExistingMimic(mimic_data) {
    let html='';
    var that = this;
    mimic_data.forEach(element => {
      html+='<div class="drag small remove" style="'+element.style+'">';
      html+='<img src="'+element.image+'" name="'+element.name+'" category="'+element.category+'" title="'+element.name+'" width="100%" height="100%">';
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
      $(this).find('.delete').click(function () {
        var r = confirm("Are you sure to delete?");
        if (r == true) {
          if($(this).parent('div').children("img").attr('category') === "Pumps") {
            that.selectedPumpsCount--;
            let pumpNumberDeleted = $(this).parent('div').children("img").attr('name');
            $(this).parent('div').remove();
            that.updateNamesOfPumps(pumpNumberDeleted);
          } else {            
            $(this).parent('div').remove();
          }
        }
      });
      $(this).dblclick(function(){
        if($(this).hasClass("ui-resizable")){
          $(this).resizable('destroy');
          $(this).find('.delete').hide();
        }
        else
        {
          $(this).resizable({
            handles: 'all',
            maxHeight: $('#droppable').height(),
            maxWidth: $('#droppable').width()
          }); 
          $(this).find('.delete').show();
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
   $(".drag-list .drag").draggable({
      helper: "clone",
      // appendTo: "#droppable",
      appendTo: "body",
      tolerance: 'fit',
      revert: true,
      cursor: 'move'
    });
  }

  manageDroppable() {
    var that = this;
    this.selectedCategory = this.categoriesArr.find(obj => obj._id === this.selectedCat);
    $("#droppable").droppable({
      accept: '.drag',
      cursor: "move",
      activeClass: "drop-area",
      drop: function (e, ui) {
        //condition to be set for no of pumps selection
        if (that.selectedPumpsCount === that.totalPumpsCount && that.selectedCategory && that.selectedCategory.name === "Pumps") {
          alert("You cannot add more pumps/motors to this mimic");
          return;
        } else {
          that.selectedPumpsCount++;
          if ($(ui.draggable)[0].id != "") {
            this.selectedEle = ui.helper.clone();
            ui.helper.remove();
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
            if(that.selectedCategory.name === "Pumps") {
              this.selectedEle.children('img').attr('name', that.selectedCategory.name +" "+ that.selectedPumpsCount);
              this.selectedEle.children('img').attr('title', that.selectedCategory.name +" "+ that.selectedPumpsCount);
            } else {
              this.selectedEle.children('img').attr('name', that.selectedCategory.name);
              this.selectedEle.children('img').attr('title', that.selectedCategory.name);
            }
            this.selectedEle.children('img').attr('category', that.selectedCategory.name);
            let el = $('<span class="xicon delete ui-icon ui-icon-close" title="Remove"></span>');
            $(el).insertAfter($(this.selectedEle.find('img')));
            this.selectedEle.appendTo('#droppable');
            this.selectedEle.find('.delete').click(function () {
              var r = confirm("Are you sure to delete?");
              if (r == true) {
                if($(this).parent('div').children("img").attr('category') === "Pumps") {
                  that.selectedPumpsCount--;
                  let pumpNumberDeleted = $(this).parent('div').children("img").attr('name');
                  $(this).parent('div').remove();
                  that.updateNamesOfPumps(pumpNumberDeleted);
                } else {                  
                  $(this).parent('div').remove();
                }
              }
            });
            //set position according body to droppable
            let currentPos=this.selectedEle.offset();
            let droppablePos=$('#droppable').offset();
            this.selectedEle.css({
              top: currentPos.top-(droppablePos.top*2+2),
              left: currentPos.left-(droppablePos.left*2+2)
            });
            this.selectedEle.dblclick(function(){
              if($(this).hasClass("ui-resizable")){
                $(this).resizable('destroy');
                $(this).find('.delete').hide();
              }
              else
              {
                $(this).resizable({
                  handles: 'all',
                  maxHeight: $('#droppable').height(),
                  maxWidth: $('#droppable').width()
                }); 
                $(this).find('.delete').show();
              }
            })
          }
        }
      }
    });
  }

  updateNamesOfPumps(pumpNumberDeleted){
    let pumpNumberDel = pumpNumberDeleted.split(" ")[1];
    $('#droppable').find('.drag').each(function(){
      let el=$(this);
      if(el.find('img').attr('category') === "Pumps"){
        let iteratedPump = el.find('img').attr('name');
        let iteratePumpNo = iteratedPump.split(" ")[1];
        if(iteratePumpNo > pumpNumberDel){
          let valuecount = (iteratePumpNo-1);
          el.find('img').attr('name', "Pumps "+ valuecount)
          el.find('img').attr('title', "Pumps "+ valuecount)
        }
      }
    });
    let dataObj = {
      pumpNumberDel: pumpNumberDel,
      siteId: this.mimicId
    }
    this.mimicService.updateBlocksArch(dataObj).subscribe(res => {
      if (res.code == 200) {
        this.saveMimic();
      }
    });
  }

  previewMimic() {    
    if ($('#droppable .drag').length == 0) this.toastr.error('You have not selected any images to show mimic preview');
    else {
        let images=[];
        $('#droppable').find('.drag').each(function(){
            let el=$(this);
            let imageAttr = {'image': el.find('img').attr('src'), 'style': el.attr('style'), 'name': el.find('img').attr('name'), 'category': el.find('img').attr('category')};
            images.push(imageAttr);
        });
        localStorage.setItem("currentMimic", JSON.stringify(images));
        this.router.navigate(["/admin/mimics/preview", this.mimicId]);
    }
  }

  saveMimic() {    
    if ($('#droppable .drag').length == 0) this.toastr.error('You have not selected any images to show mimic preview');
    else {
        let images = [];
        $('#droppable').find('.drag').each(function(){
            let el = $(this);
            let imageAttr = {'image': el.find('img').attr('src'), 'style': el.attr('style'), 'name': el.find('img').attr('name'), 'category': el.find('img').attr('category')};
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
