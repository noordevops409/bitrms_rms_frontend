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
  selector: 'app-power-report',
  templateUrl: './power-report.component.html',
  styleUrls: ['./power-report.component.scss'],
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
export class PowerReportComponent implements OnInit, OnDestroy {

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
  private siteId: any = null;
  private filterParam: any = {
    siteId: ["All"],
    siteType: ["All"],
    deviceType: ["All"],
    date: "2020/01/05 - 2020/01/08"
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
    this.loadHourlyReport();
  }

  ngOnDestroy(): void {

  }

  setDefaultFilter() {
    if (this.siteId) {
      this.filterParam.siteId = [this.siteId];
    } else {
      this.filterParam.siteId = ["All"];
    }
  }

  loadHourlyReport() {
    if (this.isChartLoading) {
      return;
    }
    this.isChartLoading = true;
    this.httpClient.post(ApiConstant.getHourlyReport, this.filterParam).subscribe((res: any) => {
      this.isChartLoading = false;
      res.datasets = res.dataSets;
      this.lineChartData = res;
      // this.loadTabular(res);
      // this.prepareChart(res.data);
    }, (err) => {
      this.isChartLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading hourly report!'
      })
    });
  }

  loadTabular(res) {
    let columns: any = [];
    let listingData: any = [];
    for (let item of res.data.dataSets) {
      columns.push({
        label: item.label,
        colField: item.label.toLowerCase().replace(/\s/g, "_"),
        footerVal: 0,
        data: item.data
      });
    }

    for (let j = 0; j < res.data.labels.length; j++) {
      let rowItem = res.data.labels[j];
      let objItem = {};
      for (let i = 0; i < columns.length; i++) {
        let colItem = columns[i];
        objItem["series" + (i + 1)] = colItem.data[j];
        this.tabView.footer["series" + (i + 1)] += colItem.data[j];
      }
      listingData.push({
        label: rowItem,
        ...objItem
      })
    }
    this.tabView.columnHeader = columns;
    this.tabView.listingData = listingData;
  }

  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }

  setFilterParam(fData) {

    let regions: any = [];
    let zones: any = [];
    let clusters: any = [];
    let siteId: any = [];
    let deviceType: any = [];
    let siteType: any = [];
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
        rangeDate = fData[3].startDate.replace(/-/g, '/') + ' - ' + fData[3].endDate.replace(/-/g, '/');
      }
    }
    this.filterParam = {
      "siteId": siteId,
      "deviceType": deviceType,
      "siteType": siteType,
      "date": rangeDate
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

  exportTableToExcel(type: string): void {
    /* pass here the table id */
    let element = document.getElementById('export-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `hourly-report-data.${type}`);

  }

  exportExcel(evt?: any) {
    evt.stopPropagation();
    evt.preventDefault();
    this.exportTableToExcel("xlsx");
  }

  exportCSV(evt?: any) {
    evt.stopPropagation();
    evt.preventDefault();
    this.exportTableToExcel("csv");
  }

  tabChanged(evt) {
    this.selTabIndex = evt.index;
  }

}
