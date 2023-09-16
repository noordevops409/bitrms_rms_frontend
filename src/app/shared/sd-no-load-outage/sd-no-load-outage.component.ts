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
  selector: 'app-sd-no-load-outage',
  templateUrl: './sd-no-load-outage.component.html',
  styleUrls: ['./sd-no-load-outage.component.scss'],
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
export class SdNoLoadOutageComponent implements OnInit, OnDestroy {

  @Input() tabData: any;
  @Input() smSiteCode: any = null;

  public isLoading: boolean = false;

  public startDate: any = new FormControl(moment());
  public endDate: any = new FormControl(moment());

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
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
  }

  loadChart(req?: any) {

    let params: any = {
      "tabId": "nav-load-outage",
      "siteId":  this.smSiteCode,
      "startDate": moment(this.startDate.value).format('YYYY-MM-DD'),
      "endDate": moment(this.endDate.value).format('YYYY-MM-DD'),
      "dateMonth": moment(this.startDate.value).format('YYYY-MM-DD'),
      "dateYear": moment(this.endDate.value).format('YYYY-MM-DD')
    };
    const url = ApiConstant.getSiteNoLoadOutageReport;
    this.httpClient.post(url, params).subscribe((res: any) => {
      this.isLoading = false;
      res.data.datasets = res.data.dataSets;
      this.lineChartData = res.data;
      // this.prepareChart(res.data);
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading no load outage report!'
      })
    });
  }

  manipulateChartData(data: any) {
    data.seriesList = [];
    for (let i = 0; i < data.dataSets.length; i++) {
      let setItem: any = data.dataSets[i];
      let dataList: any = data.dataSets[i].data;
      let list: any = [];
      for (let j = 0; j < dataList.length; j++) {
        // dataList.splice(j + 1, 1);
        let item: any = dataList[j];
        let obj: any = {
          value: item,
          meta: setItem.label + ": " + data.labels[j],
          legend: setItem.label
        };
        list.push(obj);
      }
      data.seriesList.push(list);
    }
  }

  prepareChart(res: any) {
    this.manipulateChartData(res);
    var chartData = {
      labels: res.labels,
      datasets: res.seriesList
    };
    let legendList: any = res.dataSets.map((item: any) => {
      return item.label;
    })

    var options = {
      fullWidth: true,
      height: 400,
      seriesBarDistance: 10,
      chartPadding: {
        right: 10
      },
      axisX: {
        // The offset of the labels to the chart area
        offset: 30,
        // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
        position: 'end',
        // Allows you to correct label positioning on this axis by positive or negative x and y offset.
        labelOffset: {
          x: 0,
          y: 0
        },
        // If labels should be shown or not
        showLabel: true,
        // If the axis grid should be drawn or not
        showGrid: true,
        // Interpolation function that allows you to intercept the value from the axis label
        labelInterpolationFnc: Chartist.noop,
        // Set the axis type to be used to project values on this axis. If not defined, Chartist.StepAxis will be used for the X-Axis, where the ticks option will be set to the labels in the data and the stretch option will be set to the global fullWidth option. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
        type: undefined
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        fillHoles: true,
      }),
      low: 0,
      plugins: [
        Chartist.plugins.legend({
          legendNames: legendList,
          position: 'bottom'
        }),
        Chartist.plugins.tooltip({
          appendToBody: true
        })
      ]
    };

    var responsiveOptions: any = [];

    new Chartist.Line('#websiteViewsChart1', chartData, options, responsiveOptions);
  }


}
