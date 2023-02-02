import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CommonUtilService } from '../common-util.service';
import { BroadcastService } from '../broadcast.service';

import { ApiConstant } from '../api-constant.enum';
import { AppConstant } from '../app-constant.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userData: any = null;
  private authTokenData: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  login(param: any) {
    return this.httpClient.post(ApiConstant.login, param);
  }

  setData(data: any) {
    this.userData = data;
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
}
