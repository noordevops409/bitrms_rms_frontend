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

  @Input() type: any = null;
  @Input() value: any = null;
  @Input() smSiteCode: any = null;

  @ViewChild('sdEvent', { static: true }) $sdEvent: any;

  public isLoading: boolean = false;
  public dataSource: any = [];

  private $: any = (window as any)['jQuery'];
  private scrollTimer: any = undefined;
  private scrollAreaHeight = 30;
  
  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {
    this.loadData();
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    let params: any = {
      "tabId": "nav-event-tab",
      "siteId": "MDM01113A" || this.smSiteCode,
      "username":"harish1"
    };

    const url = ApiConstant.getNoLoadOutageReport;
    this.httpClient.post(url, params).subscribe((data: any) => {
      console.log(data);
      this.isLoading = false;
      this.manipulate(data);
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading no load outage report!'
      })
    });
  }


  manipulate(data: any) {
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
