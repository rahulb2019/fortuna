import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private BASE_PATH = environment.apiEndpoint + '/users';

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
   * Function: uploadImages
   * Des: Funtion is to upload images
   */
  uploadUserImage(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/uploadImage/'}`,
      data,
      this.httpOptions
    );
  }

  /*
   * Function: addCompany
   * Des: Funtion is to add new company data
   */
  addUser(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/addUser/'}`,
      data,
      this.httpOptions
    );
  }

  /*
   * Function: updateCompanyData
   * Des: Funtion is to update company data
   */
  updateUser(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/updateUser/'}`,
      data,
      this.httpOptions
    );
  }


  /*
   * Function: fetchGymUsersData
   * Des: Funtion is to fetch all companies data
   */
  fetchUsersData(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/fetchUsersData/'}`,
      data,
      this.httpOptions
    );
  }

  /*
   * Function: deleteCompanyData
   * Des: Funtion is to fetch all companies data
   */
  deleteUser(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/deleteUser/'}`,
      data,
      this.httpOptions
    );
  }

  /*
   * Function: getUserDetail
   * Des: Funtion is to fetch companies data
   */
  getUserDetail(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/getUserDetail/'}`,
      data,
      this.httpOptions
    );
  }

  /*
   * Function: changeActivationData
   * Des: Funtion is to fetch companies data
   */
  changeActivationData(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/changeActivation/'}`,
      data,
      this.httpOptions
    );
  }

}

