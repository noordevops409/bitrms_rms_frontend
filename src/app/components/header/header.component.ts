import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { WindowsNotificationService } from '../../shared/windows-notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { BroadcastService, CommonUtilService } from 'src/app/services';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiConstant } from 'src/app/enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private isToggle: boolean = true;
  private isToggleNoti: boolean = false;

  notifications: any[] = [];
  badgeNotification: number = 0;
  prevNotificationCount: number = 0;
  isNotificationDropdownOpen: boolean = false;
  notificationSubscription: Subscription | undefined;
  resData: any;
  uniqueIds = new Set<number>();

  constructor(
    private authService: UserService,
    private broadcast: BroadcastService,
    private notificationService: WindowsNotificationService,
    private util: CommonUtilService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchInitialNotifications();
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  fetchInitialNotifications(): void {
    this.authService.fetchCriticalAlarmsWithTime().subscribe((data) => {
      this.processNotifications(data);
    });
    this.startNotificationPolling();
  }

  startNotificationPolling(): void {
    this.notificationSubscription = interval(5000)
      .pipe(switchMap(() => this.authService.fetchCriticalAlarms()))
      .subscribe((data) => {
        this.notifications = data.slice(0, 10);
        const newUnreadNotifications = this.notifications.filter(notification => {
          return notification[20] === 'Unread' && !this.uniqueIds.has(notification[0]);
        });

        if (newUnreadNotifications.length > 0) {
          newUnreadNotifications.forEach(notification => {
            this.util.notification.success({
              title: 'New Alarm',
              msg: `SiteID: ${notification[5]}, AlarmType: ${notification[7]}, Alarm Status: ${notification[14]}`,
              onClick: () => {
                this.router.navigate(['pages', 'dashboard', 'alarm-status', notification[5]]);
              }
            });
          });
          this.updateBadgeCount();
        }
      });
  }

  processNotifications(data: any[]): void {
    this.resData = data;
    this.uniqueIds.clear();
    this.resData.forEach(item => {
      if (item[20] === 'Unread') {
        this.uniqueIds.add(item[0]);
      }
    });
    this.badgeNotification = this.uniqueIds.size;
    this.updateBellIcon(this.badgeNotification);
  }

  updateBadgeCount(): void {
    this.authService.fetchCriticalAlarms().subscribe((data) => {
      this.processNotifications(data);
    });
  }

  updateBellIcon(newNotificationCount: number): void {
    const bellIcon = document.getElementById('notification-bell');
    if (bellIcon) {
      bellIcon.classList.add('new-notifications');
      bellIcon.setAttribute('matBadge', newNotificationCount >= 10 ? '10' : newNotificationCount.toString());
      bellIcon.setAttribute('matBadgeColor', 'warn');
    }
  }

  toggleSidebar(evt: any): void {
    evt.stopPropagation();
    evt.preventDefault();
    this.isToggle = !this.isToggle;
    this.broadcast.broadcast('TOGGLE_SIDEBAR', this.isToggle);
  }

  toggleNotification(): void {
    this.isToggleNoti = !this.isToggleNoti;
    this.badgeNotification = 0; // Reset badge notification count when dropdown is opened
    const dropdown = document.getElementById('notification-dropdown') as HTMLDivElement;
    const bellIcon = document.getElementById('notification-bell') as HTMLElement;

    if (this.isToggleNoti) {
      dropdown.style.display = 'block';
      bellIcon.classList.add('clicked');
      if (this.uniqueIds.size > 0) {
        this.markAsRead();
      }
    } else {
      dropdown.style.display = 'none';
      bellIcon.classList.remove('clicked');
    }
  }

  handleNotificationClick(notification: any): void {
    const dropdown = document.getElementById('notification-dropdown') as HTMLDivElement;
    const bellIcon = document.getElementById('notification-bell') as HTMLElement;
    dropdown.style.display = 'none';
    bellIcon.classList.remove('clicked');
    this.router.navigate(['pages', 'dashboard', 'alarm-status', notification]);
  }

  markAsRead(): void {
    let authToken = this.authService.getAuthToken();
    let userId = authToken.userId;

    const requestBody = {
      userId: userId,
      alridSet: Array.from(this.uniqueIds)
    };

    let url = ApiConstant.notificationRead;
    this.http.post(url, requestBody).subscribe((data: any) => {
      console.log(data);
    });
  }
}
