import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from "@angular/router";

@Component({
  selector: 'app-pages-maintainance',
  templateUrl: './pages-maintainance.component.html',
  styles: []
})
export class PagesMaintainanceComponent implements OnInit {

  videoURL: any = "https://www.youtube.com/embed/uPT2JWorQHc?autoplay=1";
  safeURL: any;
  constructor(private _sanitizer: DomSanitizer,
    private router: Router) {
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
  }

  ngOnInit() {
  }

  rouToLogin(){
    
    this.router.navigate(["/admin"]);
  }

}
