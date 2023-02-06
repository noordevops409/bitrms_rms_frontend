import { Inject, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormArray, FormBuilder, Validators, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

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
import { MatDatepicker } from '@angular/material/datepicker';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-sd-fuel-consumption',
  templateUrl: './sd-fuel-consumption.component.html',
  styleUrls: ['./sd-fuel-consumption.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SdFuelConsumptionComponent implements OnInit, OnDestroy {

  @Input() type: any = null;
  @Input() value: any = null;
  @Input() smSiteCode: any = null;

  public isLoading: boolean = false;

  public startDate: any = new FormControl(moment());
  public endDate: any = new FormControl(moment());

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

  }

  reset(evt?: any) {

  }

  fetch(evt?: any) {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.loadChart();
    this.loadPowerSourceChart();
  }

  loadChart(req?: any) {

    let params: any = {
      "tabId": "nav-fuel-consumption",
      "siteId": "MGT20421A" || this.smSiteCode,
      "startDate": moment(this.startDate.value).format('YYYY-MM-DD'),
      "endDate": moment(this.endDate.value).format('YYYY-MM-DD'),
      "dateMonth": moment(this.startDate.value).format('YYYY-MM'),
      "dateYear": moment(this.endDate.value).format('YYYY-MM')
    };

    const url = ApiConstant.getFuelConsumptionReport;
    this.httpClient.post(url, params).subscribe((data: any) => {
      console.log(data);
      this.isLoading = false;
      this.prepareChart(data);
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading fuel consumption report!'
      })
    });
  }

  manipulateChartData(data: any) {
    data.seriesList = [];
    for (let item of data.dataSets) {
      let cssClass = item.label.replace(/\s/g, '-').toLowerCase();
      let obj: any = { className: cssClass, data: item.data.slice(0, 10) };
      data.seriesList.push(obj);
    }
  }

  prepareChart(res: any) {
    this.manipulateChartData(res);
    var chartData = {
      labels: res.labels.slice(0, 10),
      series: res.seriesList
    };
    let legendList: any = res.dataSets.map((item: any) => {
      return item.label;
    })

    var options = {
      seriesBarDistance: 10,
      plugins: [Chartist.plugins.legend({
        legendNames: legendList,
        position: 'bottom'
      }), Chartist.plugins.tooltip()]
    };

    var responsiveOptions = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: (value: any) => {
            return value[0];
          }
        }
      }]
    ];

    new Chartist.Bar('#websiteViewsChart1', chartData, options, responsiveOptions);
  }

  loadPowerSourceChart() {
    let params: any = {
      "tabId": "nav-fuel-consumption",
      "siteId": "MGT20421A" || this.smSiteCode,
      "startDate": moment(this.startDate.value).format('YYYY-MM-DD'),
      "endDate": moment(this.endDate.value).format('YYYY-MM-DD'),
      "dateMonth": moment(this.startDate.value).format('YYYY-MM-DD'),
      "dateYear": moment(this.endDate.value).format('YYYY-MM-DD')
    };

    const url = ApiConstant.getPowerSourceCount;
    this.httpClient.post(url, params).subscribe((data: any) => {
      console.log(data);
      this.isLoading = false;
      this.prepareChart1(data);
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading fuel consumption report!'
      })
    });
  }

  manipulateChartData1(data: any) {
    data.seriesList = [];
    for (let item of data.dataSets) {
      let cssClass = item.label.replace(/\s/g, '-').toLowerCase();
      let obj: any = { className: cssClass, data: item.data.slice(0, 10) };
      data.seriesList.push(obj);
    }
  }

  prepareChart1(res: any) {
    this.manipulateChartData1(res);
    var chartData = {
      labels: res.labels.slice(0, 10),
      series: res.seriesList
    };
    let legendList: any = res.dataSets.map((item: any) => {
      return item.label;
    })

    var options = {
      seriesBarDistance: 10,
      plugins: [Chartist.plugins.legend({
        legendNames: legendList,
        position: 'bottom'
      }), Chartist.plugins.tooltip()]
    };

    var responsiveOptions = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: (value: any) => {
            return value[0];
          }
        }
      }]
    ];

    new Chartist.Bar('#websiteViewsChart2', chartData, options, responsiveOptions);
  }

}
