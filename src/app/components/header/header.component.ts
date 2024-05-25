import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { WindowsNotificationService } from '../../shared/windows-notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { BroadcastService, CommonUtilService } from 'src/app/services';
import { Router } from '@angular/router';

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

  constructor(
    private authService: UserService,
    private broadcast: BroadcastService,
    private notificationService: WindowsNotificationService,
    private util: CommonUtilService,
    private router: Router


  ) { }

  ngOnInit(): void {
    this.fetchInitialNotifications();
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  fetchInitialNotifications(): void {
    this.authService.fetchCriticalAlarms().subscribe((data) => {
      this.notifications = data.slice(0, 10);
      let newNotificationCount =  this.notifications.length;

      if (newNotificationCount > this.prevNotificationCount) {
        this.badgeNotification = newNotificationCount - this.prevNotificationCount;
        this.updateBellIcon(this.badgeNotification);
      }
      this.prevNotificationCount = newNotificationCount;

      // Start the interval-based polling after the initial fetch
      this.startNotificationPolling();
    });
  }

  startNotificationPolling(): void {
    this.notificationSubscription = interval(5000)
      .pipe(switchMap(() => this.authService.fetchCriticalAlarms()))
      .subscribe((data) => {
        this.notifications = data.slice(0, 10);
        let newNotificationCount = data.length;

        if (newNotificationCount > this.prevNotificationCount) {
          this.badgeNotification = newNotificationCount - this.prevNotificationCount;

          const newNotifications = this.notifications.slice(0, this.badgeNotification);
          newNotifications.forEach(notification => {
            this.util.notification.success({
              title: 'New Alarm',
              msg: `SiteID: ${notification[5]}, AlarmType: ${notification[7]}, Alarm Status: ${notification[14]}`,
              onClick: () => {
                this.router.navigate(['pages', 'dashboard', 'alarm-status', notification[5]]);
              }
            });
          });
          this.prevNotificationCount = newNotificationCount;
        }
      });
  }

  updateBellIcon(newNotificationCount: number): void {
    const bellIcon = document.getElementById('notification-bell');
    if (bellIcon) {
      console.log(newNotificationCount);
      bellIcon.classList.add('new-notifications');
      bellIcon.setAttribute('matBadge', newNotificationCount.toString());
      bellIcon.setAttribute('matBadgeColor', 'warn');
    }
  }r

  toggleSidebar(evt: any): void {
    evt.stopPropagation();
    evt.preventDefault();
    this.isToggle = !this.isToggle;
    this.broadcast.broadcast('TOGGLE_SIDEBAR', this.isToggle);
  }

  toggleNotification(): void {
    this.isToggleNoti = !this.isToggleNoti;
    this.badgeNotification = 0;
    const dropdown = document.getElementById('notification-dropdown') as HTMLDivElement;
    const bellIcon = document.getElementById('notification-bell') as HTMLElement;

    if (this.isToggleNoti) {
      dropdown.style.display = 'block';
      bellIcon.classList.add('clicked');
    } else {
      dropdown.style.display = 'none';
      bellIcon.classList.remove('clicked');
    }
  }

  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;

    if (!this.isNotificationDropdownOpen) {
      const dropdown = document.getElementById('notification-dropdown') as HTMLDivElement;
      const bellIcon = document.getElementById('notification-bell') as HTMLElement;
      dropdown.style.display = 'none';
      bellIcon.classList.remove('clicked');
    }

    if (this.isNotificationDropdownOpen) {
      this.fetchNotifications();
    }
  }

  fetchNotifications(): void {
    this.authService.fetchCriticalAlarms().subscribe((data) => {
      this.notifications = data.slice(0, 5);
      const newNotificationCount = this.notifications.length;
      if (newNotificationCount > this.prevNotificationCount) {
        this.badgeNotification = newNotificationCount - this.prevNotificationCount;
        this.updateBellIcon(this.badgeNotification);
      }
      this.prevNotificationCount = newNotificationCount;
    });
  }

  handleNotificationClick(notification: any):void{
    const dropdown = document.getElementById('notification-dropdown') as HTMLDivElement;
      const bellIcon = document.getElementById('notification-bell') as HTMLElement;
    dropdown.style.display = 'none';
      bellIcon.classList.remove('clicked');
    this.router.navigate(['pages', 'dashboard', 'alarm-status', notification]);

  }
}
