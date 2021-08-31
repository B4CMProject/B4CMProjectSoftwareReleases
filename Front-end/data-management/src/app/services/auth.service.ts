import { signupResponse } from './../models/signup';
import { loginResponse } from './../models/login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //baseUrl = 'http://3.9.188.134:3000';
    baseUrl= 'http://localhost:3000'

  constructor(
    private http: HttpClient
  ) { }

  uLogin(data: any) {
    const serviceName = '/api/v1/auth/login';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<loginResponse>(apiUrl, data, httpOptions);
  }

  uSignup(data: any) {
    const serviceName = '/api/v1/auth/signup';
    const apiUrl = `${this.baseUrl}${serviceName}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<signupResponse>(apiUrl, data, httpOptions);
  }

}
