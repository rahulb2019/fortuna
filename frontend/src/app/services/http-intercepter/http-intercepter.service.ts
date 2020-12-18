import { Injectable, Injector } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { AdminService } from "../admin/admin.service";
import { Observable } from "rxjs";

@Injectable()
export class HttpIntercepterService implements HttpInterceptor {
  private authService: AdminService;
  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(AdminService); // get it here within intercept
    if (!sessionStorage.currentLang) {
      sessionStorage.currentLang = "en";
    }
    const authRequest = request.clone({
      headers: request.headers
        .set(
          "authorization",
          this.authService.readSession()
            ? this.authService.readSession().token
            : ""
        )
        .set("currentLang", sessionStorage ? sessionStorage.currentLang : "en")
    });
    return next.handle(authRequest);
  }
}
