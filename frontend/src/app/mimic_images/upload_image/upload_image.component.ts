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
  selector: 'app-upload-image',
  templateUrl: './upload_image.component.html',
  styleUrls: []
})
export class UploadImageComponent implements OnInit {

  imageForm: FormGroup;

  isSubmitted: boolean;
  isValid: boolean = true;
  isRequiredName: boolean;
  isRequiredEmail: boolean;
  errorField: string;
  userDetails: any;
  categoriesArr: any = [];


  imageMimicError: any;
  mimic_logo: any;
  mimicImg: any = [];
  uploadedMimicImage: any = [];
  defaultMimicImage: any = "default_event_logo.jpeg";
  mimicImageData: any;
  imageState: any;

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
        console.log("this.categoriesArr-----", this.categoriesArr);
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

  changeImageState(imageSt){
    this.imageState = imageSt == 'off' ? 0 : 1;
  }

  goBack() {
    this.router.navigate(["/admin/mimics/mimic_list"]);
  }

  async onSelectImages(eventVal) {
    //return false;
    if (eventVal.target.files && eventVal.target.files.length > 0) {
      let filesArr = eventVal.target.files;
      let i=0;
      for await (let file of filesArr) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          let nameOfImage = file.name.substring(0, file.name.lastIndexOf(".") + 1);
          this.mimicImageData = {};
          this.mimicImageData.image = reader.result;
          if(file.type === "image/svg+xml"){
            this.mimicImageData.imageType = "image/svg";
          } else {
            this.mimicImageData.imageType = file.type;
          }
          let _data = {
            inputImage: this.mimicImageData,
            inputIteration: i++,
            imageName: nameOfImage.slice(0, -1),
            status: "mimic_image"
          };
          this.mimicService.uploadMimicImages(_data).subscribe(res => {
            if (res.code == 200) {
              this.uploadedMimicImage.push(res.data);
              this.mimicImg.push(environment.apiEndpoint + Folder._mimicImageOriginal + res.data);
            }
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  uploadImages() {
    if (this.imageForm.invalid) {
      const invalid = [];
      const controls = this.imageForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      this.errorField = 'error-field';
      this.isSubmitted = true;
      return;
    } else {
      this.errorField = "";
      this.imageForm.value.image_state = this.imageState != undefined ? this.imageState : 0;
      if (this.uploadedMimicImage && this.uploadedMimicImage.length > 0) {
        this.imageForm.value.mimic_images = this.uploadedMimicImage;
      }
      this.mimicService.addImages(this.imageForm.value).subscribe(res => {
        if (res.code == 200) {
              this.toastr.success(res.message);
              this.router.navigate(["/admin/mimic_images/view_gallery"]);
        } else {
          this.toastr.error(res.message);
        }
      });
    }
  }
}
