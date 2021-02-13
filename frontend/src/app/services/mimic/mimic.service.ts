import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})

export class MimicService {
  private BASE_PATH = environment.apiEndpoint + '/mimics';
  currentDocument = this.socket.fromEvent<Document>('document');

  constructor(private http: HttpClient, private router: Router,private socket: Socket) { }

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

  addMimic(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/addMimic/'}`,
      data,
      this.httpOptions
    );
  }

  addImages(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/addImages/'}`,
      data,
      this.httpOptions
    );
  }

  updateMimic(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/updateMimic/'}`,
      data,
      this.httpOptions
    );
  }

  updateMimicArch(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/updateMimicArch/'}`,
      data,
      this.httpOptions
    );
  }

  fetchMimicsData(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/fetchMimicsData/'}`,
      data,
      this.httpOptions
    );
  }


  deleteMimic(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/deleteMimic/'}`,
      data,
      this.httpOptions
    );
  }

  getMimicDetail(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/getMimicDetail/'}`,
      data,
      this.httpOptions
    );
  }

  changeMimicActivation(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/changeMimicActivation/'}`,
      data,
      this.httpOptions
    );
  }

  getAllCategories(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/getAllCategories/'}`,
      data,
      this.httpOptions
    );
  }

  
  uploadMimicImages(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/uploadMimicImages/'}`,
      data,
      this.httpOptions
    );
  }

  getAllImages(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/getAllImages/'}`,
      data,
      this.httpOptions
    );
  }

  saveBlocksData(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/saveBlocksData/'}`,
      data,
      this.httpOptions
    );
  }

  getBlocksData(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/getBlocksData/'}`,
      data,
      this.httpOptions
    );
  }
  updateBlocksArch(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/updateBlocksArch/'}`,
      data,
      this.httpOptions
    );
  }
  
  saveMimicSettings(data): Observable<any> {
    return this.http.post(
      `${this.BASE_PATH + '/saveMimicSettings/'}`,
      data,
      this.httpOptions
    );
  }
  getDocument(mimicId) {
    this.socket.emit('getDoc', mimicId);
  }

}

