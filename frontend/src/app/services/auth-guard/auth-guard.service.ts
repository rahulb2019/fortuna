import {Injectable,OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import { AdminService } from "../admin/admin.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements  CanActivate {

  constructor(private adminService: AdminService, private router: Router, private activatedRoute: ActivatedRoute,
    ) {
      
  
  }
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.adminService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/admin']);
    }
  }

}
