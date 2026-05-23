import { Inject, Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
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
export class SiteDetailsPowerReportComponent implements OnInit, AfterViewInit, OnDestroy {

  public isLoading: boolean = false;
  public isFilterSelNotValid: boolean = false;
  public listData: any = null;
  public isChartLoading: boolean = false;
  public isChartLoading1: boolean = false;
  public selTabIndex: any = 0;
  public selTabData: any = null;
  public masterForm!: FormGroup;
  public labelGlobal: any = [];
  public selectedSiteIdForChart2: string | null = "MDT20352A";


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

  public siteList: any = [];
  private params: any = null;
  public siteId: any = null;
  private filterParam: any = {
    siteId: [],
    siteType: [],
    deviceType: [],
    startDate: moment().add(-2, 'days').format('YYYY/MM/DD'),
    endDate: moment().add(-1, 'days').format('YYYY/MM/DD')
  };

  private filterParam1: any = {
    siteId: [],
    siteType: [],
    deviceType: [],
    startDate: moment().add(-2, 'days').format('YYYY/MM/DD'),
    endDate: moment().add(-1, 'days').format('YYYY/MM/DD')
  };

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

    this.initForm();
    this.loadSiteList();
    this.setDefaultFilter();
    this.loadHourlyReport();
    this.loadHourlyReport1();
  }

  ngAfterViewInit(): void {
    this.initDateParam();
  }

  ngOnDestroy(): void {

  }

  get mf() {
    return (this.masterForm as any).controls;
  }

  initDateParam() {
    // this.startDate.value = moment().add(1, "days");
    // this.masterForm.controls['startDate'].setValue(moment());
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'selSiteId': [null, [Validators.required]],
      'startDate': [moment().add(-2, 'days').format('YYYY-MM-DD')],
      'endDate': [moment().add(-1, 'days').format('YYYY-MM-DD')]
    })
  }

  loadSiteList() {
    let apiUrl: any = ApiConstant.getSiteMasterData;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.post(apiUrl, null).subscribe((res: any) => {
      if (res && res.siteMasterList && res.siteMasterList.length) {
        this.siteList = res.siteMasterList;
        this.masterForm.controls['selSiteId'].setValue(res.siteMasterList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading site details!'
      })
    });
  }

  setDefaultFilter() {
    if (this.siteId) {
      this.filterParam.siteId = [this.siteId];
      this.filterParam1.siteId = ["MDT20352A"];
    } else {
      this.filterParam.siteId = ["SGT31055A"];
    }
  }

  loadHourlyReport() {
    if (this.isChartLoading) {
      return;
    }
    this.isChartLoading = true;
    this.httpClient.post(ApiConstant.getPowerReport, this.filterParam).subscribe((res: any) => {

      this.labelGlobal = res.labels;
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
    if (this.isChartLoading1) {
      return;
    }
    this.isChartLoading1 = true;

    this.httpClient.post(ApiConstant.getPowerReport, this.filterParam1).subscribe((res: any) => {
      this.isChartLoading1 = false;

      // Check if labels array is empty or null
      if (res.labels.length === 0) {
        // Use start and end dates from the payload
        const startDate = new Date(this.filterParam1.startDate.replace(/\//g, '-')); // Convert "/" to "-"
        const endDate = new Date(this.filterParam1.endDate.replace(/\//g, '-')); // Convert "/" to "-"

        // Generate labels based on startDate and endDate
        res.labels = generateLabels(startDate, endDate);

        // Iterate through dataSets and set each data array to [0.0] if empty or with 0.0 for each label
        for (let dataSet of res.dataSets) {
          if (!dataSet.data || dataSet.data.length === 0) {
            dataSet.data = Array(res.labels.length).fill(0.0);
          } else if (dataSet.data.length < res.labels.length) {
            // If data array is shorter, fill the remaining elements with 0.0
            dataSet.data = dataSet.data.concat(Array(res.labels.length - dataSet.data.length).fill(0.0));
          }
        }
      }

      // Update other properties as needed
      for (let item of res.dataSets) {
        item.label = item.label.replace(" Energy", " Power");
      }
      res.datasets = res.dataSets;
      this.lineChartData1 = res;

      // Print labels array and data arrays
     // console.log('Labels:', res.labels);
    //  console.log('Data Arrays:', res.dataSets.map(dataSet => dataSet.data));

    }, (err) => {
      this.isChartLoading1 = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading power report!'
      });
    });

    // Function to generate labels based on start and end dates
    // Function to generate labels based on start and end dates
    function generateLabels(startDate: Date, endDate: Date): string[] {
      const labels: string[] = [];
      const uniqueDates = new Set();

      let currentDate = new Date(startDate);

      // Generate one label per day
      while (currentDate <= endDate) {
        const currentLabelDate = currentDate.toISOString().slice(0, 10);
        labels.push(currentLabelDate + " 00:00:00");

        currentDate.setHours(currentDate.getHours() + 24); // Move to the next day
      }

      return labels;
    }

  }




  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }


  tabChanged(evt) {
    this.selTabIndex = evt.index;
  }

  reset(evt?: any) {
    this.masterForm.reset();
    this.filterParam = {
      "siteId": [this.siteId],
      "deviceType": [],
      "siteType": [],
      "startDate": moment().add(-1, "days").format('YYYY-MM-DD'),
      "endDate": moment().add(-1, "days").format('YYYY-MM-DD')
    };

    this.filterParam1 = {
      "siteId": ["MDT20352A"],
      "deviceType": [],
      "siteType": [],
      "startDate": moment().add(-1, "days").format('YYYY-MM-DD'),
      "endDate": moment().add(-1, "days").format('YYYY-MM-DD')
    };
    this.loadHourlyReport();
    this.loadHourlyReport1();
  }

  fetch(evt?: any) {

    const formData = this.masterForm.value;
    this.selectedSiteIdForChart2 = this.masterForm.get('selSiteId')?.value?.smSitecode;
    this.filterParam = {
      "siteId": [this.siteId],
      "deviceType": [],
      "siteType": [],
      "startDate": moment(formData.startDate).format('YYYY-MM-DD'),
      "endDate": moment(formData.endDate).format('YYYY-MM-DD')
    };

    this.filterParam1 = {
      "siteId": [formData.selSiteId.smSitecode],
      "deviceType": [],
      "siteType": [],
      "startDate": moment(formData.startDate).format('YYYY-MM-DD'),
      "endDate": moment(formData.endDate).format('YYYY-MM-DD')
    }
    this.loadHourlyReport();
    this.loadHourlyReport1();
  }

}
