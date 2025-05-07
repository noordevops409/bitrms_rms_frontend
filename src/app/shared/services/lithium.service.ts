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

  /**
   * Fetches lithium battery data part 1 (cells 1-15)
   * @returns Observable with lithium battery data
   */
  getLithiumPart1(): Observable<any[]> {
    const authToken = this.userService.getAuthToken();
    const userID = authToken?.userId;
    
    const params = new HttpParams()
      .set('userId', userID || '');
    
    return this.httpClient.get<any[]>(ApiConstant.getLithPart1, { params });
  }

  /**
   * Fetches lithium battery data part 2 (cells 16-32)
   * @returns Observable with lithium battery data
   */
  getLithiumPart2(): Observable<any[]> {
    const authToken = this.userService.getAuthToken();
    const userID = authToken?.userId;
    
    const params = new HttpParams()
      .set('userId', userID || '');
    
    return this.httpClient.get<any[]>(ApiConstant.getLithPart2, { params });
  }
}