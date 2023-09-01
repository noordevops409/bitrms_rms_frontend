import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { CommonUtilService } from './common-util.service';
import { BroadcastService } from './broadcast.service';

import { ApiConstant } from './api-constant.enum';
import { AppConstant } from './app-constant.enum';

@Injectable({
  providedIn: 'root'
})
export class WindowsNotificationService {

  private notificationList: any = [];

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient
  ) { }

  init() {
    let permission = Notification.permission;
    if (permission === "granted") {
      this.showNotification();
    } else if (permission === "default") {
      this.requestAndShowPermission();
    } else {
      // alert("Use normal alert");
    }
    // setInterval(() => {
    //   this.showNotification();
    // }, AppConstant.NOTIFICATION_TIME_INTERVAL);
  }

  requestAndShowPermission() {
    Notification.requestPermission((permission) => {
      if (permission === "granted") {
        this.showNotification();
      }
    });
  }

  closeAll() {
    for (let item of this.notificationList) {
      if (item) {
        item.close();
      }
    }
  }

  showNotification() {
    // return;
    //  if(document.visibilityState === "visible") {
    //      return;
    //  }
    let apiUrl = ApiConstant.getHighCriticalAlarm;
    this.httpClient.get(apiUrl).subscribe((res: any) => {
      let data = res.slice(0, AppConstant.MAX_NOTIFICATION_SHOW_COUNT);
      let list: any = [];
      for (let item of data) {
        let obj: any = {
          zone: item[2],
          region: item[3],
          clusterName: item[4],
          smsiteCode: item[5],
          deviceType: item[6],
          alarmCat: item[11],
          alName: item[12],
          alStatus: item[13]
        };
        list.push(obj);
        setTimeout(() => {
          let title = "Critical Alarm " + obj.smsiteCode;
          // let icon = 'https://homepages.cae.wisc.edu/~ece533/images/zelda.png'; //this is a large image may take more time to show notifiction, replace with small size icon
          let icon = 'http://54.254.44.119:8080/digitrinity/resources/assets/images/yoma_logo.png'; //this is a large image may take more time to show notifiction, replace with small size icon
          let body = `${obj.alName}, ${obj.alStatus}, ${obj.alarmCat} \n ${obj.region}, ${obj.zone}`;

          let notification = new Notification(title, { body, icon });

          notification.onclick = () => {
            notification.close();
            window.parent.focus();
          }
          this.notificationList.push(notification);
        }, AppConstant.NOTIFICATION_TIMEOUT);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while getting high critical alarm data!'
      })
    });



  }
}
