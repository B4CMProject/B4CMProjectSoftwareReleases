import { UploadDocResponse } from './../models/uploadDocResponse';
import { Observable } from 'rxjs';
import { GetAllEscrow } from './../models/getAllEscrow';
import { GetAllAgreements } from './../models/getAllAgreements';
import { GetExistingOffer } from './../models/getAllExistingOffer';
import { GetAllOffers } from './../models/getAllOffers';
import { createOffer } from './../models/createOffer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  private sec_key = '';
  usertoken: any;
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) {
    const tDate = Date();
    this.sec_key = `xx${this.formatDate(tDate, 'ddMM')}xxx${this.formatDate(tDate, 'yyyy')}xxxxx`;
    this.usertoken = sessionStorage.getItem('uToken');
  }

  revokeAgreement(data: any) {
    const serviceName = '/api/v1/dataagreement/revokeAgreement';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  getCosts() {
    const serviceName = '/api/v1/cost/totalCost';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }

  getDataHashByOfferId(data: any, endPoint: string) {
    const serviceName = '/api/v1/datahash/' + endPoint;
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  setNewHashOffer(data: any) {
    const serviceName = '/api/v1/datahash';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  uploadFile(fileToUpload: any) {
    const serviceName = '/api/v1/files';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/pdf',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.post<UploadDocResponse>(apiUrl, fileToUpload, httpOptions);
  }

  getAllEscrow() {
    const serviceName = '/api/v1/escrow';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.get<GetAllEscrow>(apiUrl, httpOptions);
  }

  getAllAgreements() {
    const serviceName = '/api/v1/dataagreement';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.get<GetAllAgreements>(apiUrl, httpOptions);
  }

  updateOffer(data: any) {
    const serviceName = '/api/v1/offer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.put<any>(apiUrl, data, httpOptions);
  }

  onAcceptRejectRequest(data: any) {
    // http://localhost:3000/api/v1/offerRequest/acceptReject
    const serviceName = '/api/v1/offerRequest/acceptReject';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  getAllExistingOffer() {
    const serviceName = '/api/v1/offer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.get<GetExistingOffer>(apiUrl, httpOptions);
  }

  getAllRequests() {
    const serviceName = '/api/v1/offerRequest';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.get<any>(apiUrl, httpOptions);
  }

  sendRequest(data: any) {
    const serviceName = '/api/v1/offerRequest';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.post<any>(apiUrl, data, httpOptions);
  }

  submitOffer(data: any) {
    const serviceName = '/api/v1/offer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.post<createOffer>(apiUrl, data, httpOptions);
  }

  getOffers() {
    const serviceName = '/api/v1/offer';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.usertoken,
      }),
    };
    return this.http.get<GetAllOffers>(apiUrl, httpOptions);
  }


  formatDate(value: any, dateFormat: string) {
    return formatDate(value, dateFormat, 'en-GB')
  }

  generate_UUID() {
    let dtd = new Date().getTime();
    return this.sec_key.replace(/[xy]/g, cached => {
      var rKey = (dtd + Math.random() * 999) % 32 | 0;
      dtd = Math.floor(dtd / 32);
      return (cached == "x" ? rKey : (rKey & 0x3) | 0x8).toString(32).toUpperCase();
    });
  }

  generate_HASH_ID() {
    const tDate = Date();
    const hash_key = `xxxxx-xxxx${this.formatDate(tDate, 'ddMM')}xxxxxx-xxx${this.formatDate(tDate, 'yy')}xxxxxx-xxxxxx`;
    let dtd = new Date().getTime();
    return hash_key.replace(/[xy]/g, cached => {
      var rKey = (dtd + Math.random() * 999) % 32 | 0;
      dtd = Math.floor(dtd / 32);
      return (cached == "x" ? rKey : (rKey & 0x3) | 0x8).toString(32);
    });
  }


}
