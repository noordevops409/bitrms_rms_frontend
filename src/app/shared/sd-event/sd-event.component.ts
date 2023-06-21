import { Inject, Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormArray, FormBuilder, Validators, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { iif, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';


import { BroadcastService } from '../../shared/broadcast.service';
import { CommonUtilService } from '../../shared/common-util.service';
import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';

import * as Chartist from 'chartist';
import 'chartist-plugin-tooltips';
import 'chartist-plugin-legend';
import * as moment from 'moment';

@Component({
  selector: 'app-sd-event',
  templateUrl: './sd-event.component.html',
  styleUrls: ['./sd-event.component.scss']
})
export class SdEventComponent implements OnInit, OnDestroy {

  @Input() tabData: any;
  @Input() smSiteCode: any = null;

  @ViewChild('sdEvent', { static: true }) $sdEvent: any;

  public isLoading: boolean = false;
  public dataSource: any = [];

  private $: any = (window as any)['jQuery'];
  private scrollTimer: any = undefined;
  private scrollAreaHeight = 30;
  private siteId: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.siteId = paramMap.get('siteId');
    });
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {
    this.loadData();
  }

  secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    let params: any = {
      "tabId": "nav-event-tab",
      "siteId": this.siteId || "AYM00657T",
      "series2": "",
      "series3": "",
      "series4": "",
      "series5": "",
      "series6": "",
      "series7": "",
      "reportType": "Daily",
      "startDate": "",
      "endDate": "",
      "dateMonth": "",
      "dateYear": ""
    };

    const url = ApiConstant.getPerfDashEvent;
    this.httpClient.post(url, params).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.data && res.data.length) {
        this.manipulate(res.data);
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading no load outage report!'
      })
    });
  }


  manipulate(data: any) {
    for (let item of data) {
      item.displayAge = this.secondsToDhms(item.age);
    }
    this.dataSource = data;
  }

  bindEvent() {
    const self = this;

    const elBody = this.$(this.$sdEvent.nativeElement).find('.gbody');
    this.$(this.$sdEvent.nativeElement).find('.gbody').unbind('scroll').bind('scroll', () => {
      self.onBodyScroll(elBody[0], elBody.prev(), elBody);
    });
  }

  private onBodyScroll(gbodyDom: any, ghead: any, gbody: any) {
    ghead.scrollLeft(gbody.scrollLeft());
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      if ((gbodyDom.scrollHeight - gbodyDom.clientHeight - this.scrollAreaHeight) < gbody.scrollTop()) {

      }
    }, 200);
  }


}
