import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowsNotificationService {

  constructor() { }

  init() {
    let permission = Notification.permission;
    if (permission === "granted") {
      this.showNotification();
    } else if (permission === "default") {
      this.requestAndShowPermission();
    } else {
      alert("Use normal alert");
    }
  }

  requestAndShowPermission() {
    Notification.requestPermission((permission) => {
      if (permission === "granted") {
        this.showNotification();
      }
    });
  }

  showNotification() {
    //  if(document.visibilityState === "visible") {
    //      return;
    //  }
    let title = "I love Educative.io";
    let icon = 'https://homepages.cae.wisc.edu/~ece533/images/zelda.png'; //this is a large image may take more time to show notifiction, replace with small size icon
    let body = "Message to be displayed";

    let notification = new Notification(title, { body, icon });

    notification.onclick = () => {
      notification.close();
      window.parent.focus();
    }

  }
}
