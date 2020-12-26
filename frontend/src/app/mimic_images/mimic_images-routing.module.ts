import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewGalleryComponent } from './view_gallery/view_gallery.component';
import { UploadImageComponent } from './upload_image/upload_image.component';



const routes: Routes = [
  {
    path: 'view_gallery',
    component: ViewGalleryComponent
  },
  {
    path: 'upload_image',
    component: UploadImageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MimicImagesRoutingModule { }
