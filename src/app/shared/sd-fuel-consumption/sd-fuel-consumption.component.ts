import { Inject, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";


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

  @Input() tabData: any;
  @Input() smSiteCode: any = null;

  public isLoading: boolean = false;

  public startDate: any = new FormControl(moment());
  public endDate: any = new FormControl(moment());

  public lineChartFuelData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public lineChartPowerData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      xAxes: {
        reverse: true
      }
    },
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        callbacks: {
          labelColor: (context) => {
            let dataSet: any = context.dataset;
            return {
              borderColor: dataSet.borderColor,
              backgroundColor: dataSet.backgroundColor,
              borderWidth: 1
            };
          }
        }
      }
    }
  };
  public lineChartLegend = true;

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
      "dateMonth": moment(this.startDate.value).format('YYYY-MM-DD'),
      "dateYear": moment(this.endDate.value).format('YYYY-MM-DD')
    };

    const url = ApiConstant.getSiteFuelConsumptionReport;
    this.httpClient.post(url, params).subscribe((res: any) => {
      this.isLoading = false;
      // res.data.labels.sort();
      // for (let item of res.data.dataSets) {
      //   item.data.sort();
      // }
      res.data.datasets = res.data.dataSets;
      this.lineChartFuelData = res.data;
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading fuel consumption report!'
      })
    });
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

    const url = ApiConstant.getSitePowerSource;
    this.httpClient.post(url, params).subscribe((res: any) => {
      this.isLoading = false;
      res.data.datasets = res.data.dataSets;
      this.lineChartPowerData = res.data;
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading fuel consumption report!'
      })
    });
  }

}
