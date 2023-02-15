import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public selectReport: string = '';


  constructor(
    private router: Router
  ) { }

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
