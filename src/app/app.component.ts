import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { BroadcastService } from './shared/broadcast.service';
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

  constructor(
    private broadcast: BroadcastService,
    private ngZone: NgZone
  ) {

  }

  ngOnInit(): void {
    this.listen();
    this.init();
  }

  ngOnDestroy(): void {
    this.toggleSidebar.unsubscribe();
  }

  listen() {
    this.toggleSidebar = this.broadcast.on<string>('TOGGLE_SIDEBAR').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.isToggle = data;
      });
    });
  }

  init() {
    
  }

}
