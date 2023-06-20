import { Inject, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import * as XLSX from 'xlsx';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  }
};

@Component({
  selector: 'app-site-details-power-report',
  templateUrl: './site-details-power-report.component.html',
  styleUrls: ['./site-details-power-report.component.scss']
})
export class SiteDetailsPowerReportComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;
  public startDate: any = new FormControl(moment());
  public endDate: any = new FormControl(moment());
  public listData: any = null;
  public isChartLoading: boolean = false;
  public selTabIndex: any = 0;
  public selTabData: any = null;

  public isReqToOpenFilter: boolean = false;
  public isOpenTabularFilter: boolean = false;
  public isExpanded: boolean = false;
  public defaultFilterList: any = [
    {
      id: 'FMF01',
      fieldName: 'siteId',
      indexField: 'siteId',
      labelName: 'Site Id',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'siteId',
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
      xhrUrl: ApiConstant.getSiteCode,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'code',
        value: 'code'
      }
    },
    {
      id: 'FMF02',
      fieldName: 'deviceType',
      indexField: 'deviceType',
      labelName: 'Device Type',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'deviceType',
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
      xhrUrl: ApiConstant.getDeviceTypeMaster,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'deviceType',
        value: 'deviceType'
      }
    }
  ];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return value + ' kw';
          }
        }
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

  public tabView: any = {
    columnHeader: [],
    listingData: [],
    footer: {
      series1: 0,
      series2: 0,
      series3: 0,
      series4: 0,
      series5: 0,
      series6: 0,
      series7: 0
    }
  };

  private params: any = null;
  public siteId: any = null;
  private filterParam: any = {
    siteId: [],
    siteType: [],
    deviceType: [],
    startDate: "2020/01/01",
    endDate: "2020/01/01"
  };



  public startDate1: any = new FormControl(moment());
  public endDate1: any = new FormControl(moment());
  public listData1: any = null;
  public isChartLoading1: boolean = false;
  public selTabIndex1: any = 0;
  public selTabData1: any = null;

  public isReqToOpenFilter1: boolean = false;
  public isOpenTabularFilter1: boolean = false;
  public isExpanded1: boolean = false;
  public defaultFilterList1: any = [
    {
      id: 'FMF01',
      fieldName: 'siteId',
      indexField: 'siteId',
      labelName: 'Site Id',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'siteId',
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
      xhrUrl: ApiConstant.getSiteCode,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'code',
        value: 'code'
      }
    },
    {
      id: 'FMF02',
      fieldName: 'deviceType',
      indexField: 'deviceType',
      labelName: 'Device Type',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'deviceType',
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
      xhrUrl: ApiConstant.getDeviceTypeMaster,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'deviceType',
        value: 'deviceType'
      }
    }
  ];

  public lineChartData1: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public lineChartOptions1: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return value + ' kw';
          }
        }
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
  public lineChartLegend1 = true;

  public tabView1: any = {
    columnHeader: [],
    listingData: [],
    footer: {
      series1: 0,
      series2: 0,
      series3: 0,
      series4: 0,
      series5: 0,
      series6: 0,
      series7: 0
    }
  };

  private params1: any = null;
  private siteId1: any = null;
  private filterParam1: any = {
    siteId: ["SGT31055A"],
    siteType: [],
    deviceType: [],
    startDate: "2020/01/01",
    endDate: "2020/01/01"
  };

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
    // this.filterParam.siteId.push(this.siteId);
    this.setDefaultFilter();
    this.setDefaultFilter1();
    this.loadHourlyReport();
    this.loadHourlyReport1();
  }

  ngOnDestroy(): void {

  }

  setDefaultFilter() {
    if (this.siteId) {
      this.filterParam.siteId = [this.siteId];
    } else {
      this.filterParam.siteId = ["SGT31055A"];
    }
  }

  setDefaultFilter1() {
    this.filterParam1.siteId = ["SGT31055A"];
  }


  loadHourlyReport() {
    if (this.isChartLoading) {
      return;
    }
    this.isChartLoading = true;
    this.httpClient.post(ApiConstant.getPowerReport, this.filterParam).subscribe((res: any) => {
      this.isChartLoading = false;
      for (let item of res.dataSets) {
        item.label = item.label.replace(" Energy", " Power");
      }
      res.datasets = res.dataSets;
      this.lineChartData = res;
    }, (err) => {
      this.isChartLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading power report!'
      })
    });
  }

  loadHourlyReport1() {
    if (this.isChartLoading) {
      return;
    }
    this.isChartLoading = true;
    this.httpClient.post(ApiConstant.getPowerReport, this.filterParam1).subscribe((res: any) => {
      this.isChartLoading = false;
      for (let item of res.dataSets) {
        item.label = item.label.replace(" Energy", " Power");
      }
      res.datasets = res.dataSets;
      this.lineChartData = res;
    }, (err) => {
      this.isChartLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading power report!'
      })
    });
  }

  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }

  openTabularFilter1(evt?: any) {
    this.isOpenTabularFilter1 = !this.isOpenTabularFilter1;
  }

  setFilterParam(fData) {

    let regions: any = [];
    let zones: any = [];
    let clusters: any = [];
    let siteId: any = [];
    let deviceType: any = [];
    let siteType: any = [];
    let startDate: any = null;
    let endDate: any = null;
    let rangeDate: any = "";
    if (fData && fData.length) {
      siteId = fData[0].popupTo.data.map((item) => {
        return item.id;
      });
      deviceType = fData[1].popupTo.data.map((item) => {
        return item.id;
      });

      // clusters = fData[2].popupTo.data.map((item) => {
      //   return item.id;
      // });

      // siteId = fData[3].popupTo.data.map((item) => {
      //   return item.id;
      // });

      // deviceType = fData[4].popupTo.data.map((item) => {
      //   return item.id;
      // });

      // siteType = fData[5].filter((item) => {
      //   return item.isChecked && item.text;
      // }).map((item) => {
      //   return item.text;
      // });

      if (fData[3] && fData[3].startDate && fData[3].endDate) {
        startDate = fData[3].startDate.replace(/-/g, '/');
        endDate = fData[3].endDate.replace(/-/g, '/');
        rangeDate = fData[3].startDate.replace(/-/g, '/') + ' - ' + fData[3].endDate.replace(/-/g, '/');
      }
    }
    this.filterParam = {
      "siteId": siteId,
      "deviceType": deviceType,
      "siteType": siteType,
      "startDate": startDate,
      "endDate": endDate
    };
  }

  setFilterParam1(fData) {

    let siteId: any = [];
    let deviceType: any = [];
    let startDate: any = null;
    let endDate: any = null;
    let rangeDate: any = "";
    if (fData && fData.length) {
      siteId = fData[0].popupTo.data.map((item) => {
        return item.id;
      });
      deviceType = fData[1].popupTo.data.map((item) => {
        return item.id;
      });

      if (fData[3] && fData[3].startDate && fData[3].endDate) {
        startDate = fData[3].startDate.replace(/-/g, '/');
        endDate = fData[3].endDate.replace(/-/g, '/');
        rangeDate = fData[3].startDate.replace(/-/g, '/') + ' - ' + fData[3].endDate.replace(/-/g, '/');
      }
    }
    this.filterParam1 = {
      "siteId": siteId,
      "deviceType": deviceType,
      "startDate": startDate,
      "endDate": endDate
    };
  }

  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
    this.isOpenTabularFilter = false;
    if (evt) {
      this.setFilterParam(evt);
    } else {
      this.setDefaultFilter();
    }
    this.loadHourlyReport();
  }

  applyFilter1(evt?: any) {
    this.isReqToOpenFilter1 = false;
    this.isOpenTabularFilter1 = false;
    if (evt) {
      this.setFilterParam1(evt);
    } else {
      this.setDefaultFilter1();
    }
    this.loadHourlyReport1();
  }

  tabChanged(evt) {
    this.selTabIndex = evt.index;
  }

}
