import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from "@angular/router";
import { WindowsNotificationService } from '../shared/windows-notification.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private winNotification: WindowsNotificationService
  ) {

  }

  ngOnInit(): void {
    (window as any).localStorage.clear();
    this.winNotification.closeAll();
    localStorage.removeItem('userData');
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    
  }

}
