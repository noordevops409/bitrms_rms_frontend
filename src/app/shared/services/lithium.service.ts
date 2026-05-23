import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstant } from '../api-constant.enum';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LithiumService {
  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) { }

  getLithiumPart1(): Observable<any[]> {
    const authToken = this.userService.getAuthToken();
    const userID = authToken?.userId;
    const params = new HttpParams().set('userId', userID || '');
    return this.httpClient.get<any[]>(ApiConstant.getLithPart1, { params });
  }

  getLithiumPart2(): Observable<any[]> {
    const authToken = this.userService.getAuthToken();
    const userID = authToken?.userId;
    const params = new HttpParams().set('userId', userID || '');
    return this.httpClient.get<any[]>(ApiConstant.getLithPart2, { params });
  }

  getLithiumPart3(): Observable<any[]> {
    const authToken = this.userService.getAuthToken();
    const userID = authToken?.userId;
    const params = new HttpParams().set('userId', userID || '');
    return this.httpClient.get<any[]>(ApiConstant.getLithPart3, { params });
  }

  getLithiumPart4(): Observable<any[]> {
    const authToken = this.userService.getAuthToken();
    const userID = authToken?.userId;
    const params = new HttpParams().set('userId', userID || '');
    return this.httpClient.get<any[]>(ApiConstant.getLithPart4, { params });
  }
}
