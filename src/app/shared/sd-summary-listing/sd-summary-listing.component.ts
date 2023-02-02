import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BroadcastService } from '../../shared/broadcast.service';
import { CommonUtilService } from '../../shared/common-util.service';
import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';

@Component({
  selector: 'app-sd-summary-listing',
  templateUrl: './sd-summary-listing.component.html',
  styleUrls: ['./sd-summary-listing.component.scss']
})
export class SdSummaryListingComponent implements OnInit, OnDestroy {

  @Input() tabData: any;
  @Input() data: any;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {
    // this.loadData();
  }

}
