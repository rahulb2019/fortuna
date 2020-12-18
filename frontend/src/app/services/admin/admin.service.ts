import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private BASE_PATH = environment.apiEndpoint + '/admin';

  constructor(private http: HttpClient, private router: Router) { }

  // Add options on Http Request
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Handle error on Http Request
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Status : ${error.status}, ` +
        `Response : ${error.error}`);
    }
    return throwError(
      'Something want wrong. please try again later.');
  }

  /*
   * Function: setSession
   * Des: Funtion is use to set local storage
   */
  setSession(data) {
    sessionStorage.admin_login = JSON.stringify(data);
  }  

  /*
   * Function: readSession
   * Des: Funtion is use to read local storage
   */
  readSession() {
    if (sessionStorage.admin_login) {
      return JSON.parse(sessionStorage.admin_login);
    }
  }

  
  /*
   * Function: isAuth
   * Des: Funtion is use to check auth
   */
  isAuth() {
    if (sessionStorage.admin_login) {
      return true;
    } else {
      return false;
    }
  }

  
  /*
   * Function: logout
   * Des: Funtion is use to log out and remove all session and local storage
   */
  logout() {
    sessionStorage.removeItem("admin_login")
    sessionStorage.clear();
    window.sessionStorage.clear();
    console.log("..sessionStorage2...", sessionStorage);//return false;
    this.router.navigate(['/admin']);
  }


  /*
   * Function: Login
   * Des: Funtion is use for login for all type of user
   */
  loginAdmin(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/loginAdmin/'}`,
      data,
      this.httpOptions
    );
  }

  /*
   * Function: resetPasswordAdminFnc
   * Des: Funtion is use for register for all type of admin
   */
  resetPasswordAdminFnc(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/resetPasswordAdmin/'}`,
      data,
      this.httpOptions
    );
  }

  /*
   * Function: accountSetting
   * Des: Funtion is to add new company data
   */
  accountSetting(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/accountSetting/'}`,
      data,
      this.httpOptions
    );   
  }

  /*
    * Function: setUserData
    * Des: Funtion is use to set user data in local storage
    */
   setUserData(data) {
    let tempObj = JSON.parse(sessionStorage.admin_login);
    //tempObj['userdata'] = data;
    sessionStorage.admin_login = JSON.stringify(data);
  } 


}

