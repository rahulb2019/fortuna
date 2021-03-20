import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder, FormGroup, FormArray, FormControl, Validators
} from "@angular/forms";
import { MimicService } from "../../services/mimic/mimic.service";
import { ToastrService } from "ngx-toastr";
import { Folder } from "../../config/constants";
import { environment } from "../../../environments/environment";

import * as $ from 'jquery';

@Component({
  selector: 'app-view-gallery',
  templateUrl: './view_gallery.component.html',
  styleUrls: []
})
export class ViewGalleryComponent implements OnInit {

  imageForm: FormGroup;
  categoriesArr: any = [];
  selectedImages: any = [];
  selectedCat: any;
  imageState: any = 0;
  imageUrl = environment.apiEndpoint + Folder._mimicImageOriginal;

  constructor(
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private mimicService: MimicService,
    private toastr: ToastrService) {  
      this.createImageFormFnc();
      this.getAllCategories();
  }

  ngOnInit() {  
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

  createImageFormFnc() {
    this.imageForm = this.fb.group({
      site_image_category_id: ['', [Validators.required]],
      image_state: [0, [Validators.required]],
    });
  }


  goBack(){
    this.router.navigate(["/admin/mimics/mimic_list"]);
  }

  changeImageState(imageSt){
    this.imageState = imageSt == 'off' ? 0 : 1;
    this.getAllImages();
  }

  changeSelectedCategory(event){
    this.selectedCat = event.target.value ? event.target.value : this.selectedCat;
    this.getAllImages();
  }

  deleteImage(selectedImage) {
    if (confirm('Please confirm! Do you really want to delete the image?')) {
      this.mimicService.deleteImage(selectedImage).subscribe(res => {
        if (res.code === 200) {
          this.toastr.success("Image deleted successfully!");
          this.getAllCategories();
        }
        else {
          this.toastr.error(res.message); //alert error message
        }
      });
    }
  }

  getAllImages(){
    let data = {
      site_image_category_id: this.selectedCat,
      state: this.imageState
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
}
