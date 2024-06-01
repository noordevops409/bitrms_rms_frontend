import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from "@angular/router";
import { WindowsNotificationService } from '../shared/windows-notification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiConstant } from '../shared/api-constant.enum';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private winNotification: WindowsNotificationService,
    private httpClient: HttpClient,

  ) {

  }

  ngOnInit(): void {
    this.winNotification.closeAll();
    let userDataString = localStorage.getItem('userData');
    if (userDataString) {
      let userData = JSON.parse(userDataString);
      
      let id = userData.userId;
      
      const url = `${ApiConstant.logout}?umId=${id}`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      
      this.httpClient.post(url, {}, { headers }).subscribe((res: any) => {
          console.log(res);
      });
  } else {
      console.log('userData not found in localStorage');
  }
  (window as any).localStorage.clear();
    localStorage.removeItem('userData');
    this.router.navigate(['login']);
  }

  

}
