import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { AdminService } from "../admin/admin.service";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
//import { map, do } from "rxjs/operators";
// import { do } from "rxjs";
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class HttpResponseIntercepterService implements HttpInterceptor {
  private authService: AdminService;

  constructor(private injector: Injector, private router: Router) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.authService = this.injector.get(AdminService); // get it here within intercept
    const authRequest = request.clone();
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        if (event.body != null) {
          if (event.body.code === 401) {
            delete sessionStorage.admin_login;
            this.authService.logout();
            sessionStorage.clear();
            this.router.navigate(['/admin']);
            //this.dialog.closeAll();
            //this.loader.Stop();
          }
        } else {
          const responseToken = event.headers.get('token');
        }

      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          delete sessionStorage.admin_login;
          this.router.navigate(['/admin']);
          sessionStorage.clear();
          //this.dialog.closeAll();
          //this.loader.Stop();
        }
      }
    });
  }
}


