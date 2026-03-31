import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CommonUtilService } from '../common-util.service';
import { BroadcastService } from '../broadcast.service';

import { ApiConstant } from '../api-constant.enum';
import { AppConstant } from '../app-constant.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  static getData() {
      throw new Error('Method not implemented.');
  }

  private userData: any = null;
  private authTokenData: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  login(param: any): Observable<any> {
    return this.httpClient.post(ApiConstant.login, param);
  }

  setData(data: any) {
    this.userData = data;
    console.log("line 37",data.countryID);

    if (data.countryID == 0) {
      // Set countryID to an array containing both 1 and 2, then randomly select one
      data.countryID = [1, 2];
    }
    (window as any).localStorage.removeItem('userData');
    (window as any).localStorage.setItem('userData', JSON.stringify(this.userData));
    this.setAuthToken(data);
  }

  getData() {
    if ((window as any).localStorage.getItem('userData')) {
      return JSON.parse((window as any).localStorage.getItem('userData'));
    } else {
      return null;
    }
  }

  authToken(param: any) {
    return this.httpClient.post(ApiConstant.authToken, param);
  }

  setAuthToken(data: any) {
    this.authTokenData = data;
    (window as any).localStorage.removeItem('authToken');
    (window as any).localStorage.setItem('authToken', JSON.stringify(this.authTokenData));
  }

  getAuthToken() {
    if ((window as any).localStorage.getItem('authToken')) {
      return JSON.parse((window as any).localStorage.getItem('authToken'));
    } else {
      return null;
    }
  }

  clearAuthToken() {
    this.authTokenData = null;
    this.userData = null;
    (window as any).localStorage.removeItem('authToken');
    (window as any).localStorage.removeItem('userData');
  }
  fetchCriticalAlarms(): Observable<any[]> {
    // You can use the authentication token or any other required data here
    const authToken = this.getAuthToken(); // Assuming you have a getAuthToken method
    const headers = {
      Authorization: `Bearer ${authToken}`, // Include the authentication token in the headers if required
    };
    let userID=authToken.userId;

    const params = new HttpParams()
    .set('userId',userID);
    // Make the API request to fetch critical alarms
    return this.httpClient.get<any[]>(ApiConstant.getHighCriticalAlarm,{  params });
  }
  fetchCriticalAlarmsWithTime(): Observable<any[]> {
    // You can use the authentication token or any other required data here
    const authToken = this.getAuthToken(); // Assuming you have a getAuthToken method
    const headers = {
      Authorization: `Bearer ${authToken}`, // Include the authentication token in the headers if required
    };
    let userID=authToken.userId;
    let loginTime=authToken.umLoginTime;
    let logoutTime=authToken.umLogoutTime;

    const params = new HttpParams()
    .set('userId',userID)
    .set('loginTime', loginTime)
    .set('logoutTime', logoutTime);
  
    // Make the API request to fetch critical alarms
    return this.httpClient.get<any[]>(ApiConstant.getHighCriticalAlarmTime, {  params });
  }
  
}
