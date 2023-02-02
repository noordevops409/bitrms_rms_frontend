import { Component, OnInit } from '@angular/core';

import { BroadcastService } from '../../shared/broadcast.service';
import { CommonUtilService } from '../../shared/common-util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private isToggle: boolean = true;

  constructor(
    private broadcast: BroadcastService,
    private util: CommonUtilService
  ) { }

  ngOnInit(): void {
  }

  toggleSidebar(evt?: any) {
    evt.stopPropagation();
    evt.preventDefault();
    this.isToggle = !this.isToggle;
    this.broadcast.broadcast('TOGGLE_SIDEBAR', this.isToggle);
  }

}
