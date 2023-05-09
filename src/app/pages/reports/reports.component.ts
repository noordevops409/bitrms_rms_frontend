import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public selectReport: string = '';


  constructor(
    private router: Router
  ) {

    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        setTimeout(() => {
          this.init();
        }, 500);
      }
    });
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.selectReport = this.router.url;
  }

  changeReportType(evt?: any) {
    this.router.navigateByUrl(this.selectReport);
  }

}
