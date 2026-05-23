import { Component, OnInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { BroadcastService } from './shared/broadcast.service';
import { UserService } from './shared/services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'rms';
  public isToggle: boolean = true;
  private toggleSidebar!: Subscription;
  private lastActivity: number = Date.now();
  private activityCheckInterval: any;
  private readonly INACTIVITY_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

  constructor(
    private broadcast: BroadcastService,
    private ngZone: NgZone,
    private userService: UserService,
    private router: Router
  ) {

  }

  @HostListener('document:click')
  @HostListener('document:keypress')
  @HostListener('document:mousemove')
  resetActivityTimer() {
    this.lastActivity = Date.now();
  }

  ngOnInit(): void {
    this.listen();
    this.init();
  }

  ngOnDestroy(): void {
    this.toggleSidebar.unsubscribe();
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
    }
  }

  listen() {
    this.toggleSidebar = this.broadcast.on<string>('TOGGLE_SIDEBAR').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.isToggle = data;
      });
    });
  }

  init() {
    // Check for inactivity every 5 minutes
    this.activityCheckInterval = setInterval(() => {
      this.checkInactivity();
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  checkInactivity() {
    const currentTime = Date.now();
    const inactiveTime = currentTime - this.lastActivity;
    
    // If user has been inactive for more than 4 hours
    if (inactiveTime > this.INACTIVITY_TIMEOUT) {
      const authToken = this.userService.getAuthToken();
      // Only redirect if user is logged in and on a protected page
      if (authToken && !this.router.url.includes('/login')) {
        console.warn('User inactive for 4+ hours. Clearing session and redirecting to login...');
        this.userService.clearAuthToken();
        this.router.navigate(['login'], { replaceUrl: true });
      }
    }
  }

}
