import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CommonUtilService } from '../../../shared/common-util.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TOWER_STATUS_COLUMN_HEADER } from '../tower-status-column.enum';
// import { ALARM_STATUS_COLUMN_HEADER } from './alarm-status-column.enum';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';
import { BroadcastService } from '../../../shared/broadcast.service';
import * as MyLegend from 'chartist-plugin-legend';

import * as Chartist from 'chartist';
import * as moment from 'moment';
import 'chartist-plugin-tooltips';
import 'chartist-plugin-legend';
import { Subscription } from 'rxjs';

import { alarmCategory } from '../../data/alarm-category';
import { alarmStatus } from '../../data/alarm-status';
import { clusterMaster } from '../../data/cluster-master';
import { customerMaster } from '../../data/customer-master';
import { deviceTypeMaster } from '../../data/device-type-master';
import { hourlyReport } from '../../data/hourly-report';
import { latestData } from '../../data/latest-data';
import { latestReportStatus } from '../../data/latest-report-status';
import { regionMaster } from '../../data/region-master';
import { siteCodeMaster } from '../../data/site-code-master';
import { siteTypeMaster } from '../../data/site-type-master';
import { zoneMaster } from '../../data/zone-master';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';
import { SiteDetailsComponent } from '../../../shared/site-details/site-details.component';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit, OnDestroy {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  @ViewChild('alarmElem', { static: true }) $alarmElem: any;

  @ViewChild(TableListingComponent, { static: true }) public tableListingComponent!: TableListingComponent;

  public isLoading: boolean = false;
  public isAlarmStatusLoading: boolean = false;
  public isListServerError: boolean = false;
  public isAlarmStatusListServerError: boolean = false;

  public parentHeight: any = null;
  public selectedRow: any = null;
  public multipleSelRow: any = null;
  public list = [];
  public list1 = [];
  public appType: Number = AppConstant.LATEST_DATA1_APP_TYPE;
  public appType1: Number = AppConstant.ALARM_STATUS_APP_TYPE;

  public activeListing: any = {};
  public data: any;
  public listingTemplate: any = {};
  public isAlarmCategoryOpen: boolean = false;

  public latestReportStatus: any = {
    "offlineSite": 63,
    "onlineSite": 773,
    "totalSite": 836
  };

  isReqToOpenFilter: boolean = false;
  isReqToOpenAlarmStatusFilter: boolean = false;
  isOpenTabularFilter: boolean = false;
  isOpenAlarmStatusFilter: boolean = false;

  isExpanded: boolean = false;

  defaultFilterListAlarmStatus: any = [
    {
      id: 'FMF01',
      fieldName: 'category',
      indexField: 'category',
      labelName: 'Category',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'category',
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'POST',
      xhrUrl: ApiConstant.getAlarmCategory,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'category',
        value: 'category'
      }
    }
  ];

  defaultFilterList: any = [
    {
      id: 'FMF01',
      fieldName: 'regions',
      indexField: 'regions',
      labelName: 'Region',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'regions',
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'POST',
      xhrUrl: ApiConstant.getRegionMaster,
      xhrParam: [
        {
          "rgRegion": "string",
          "rgRegionID": "string",
          "znZoneID": "string"
        }
      ],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'rgRegionID',
        value: 'rgRegion'
      }
    },
    {
      id: 'FMF02',
      fieldName: 'zones',
      indexField: 'zones',
      labelName: 'Zone',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'zones',
      data: zoneMaster,
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'POST',
      xhrUrl: ApiConstant.getZoneMaster,
      xhrParam: [
        {
          "rgRegionID": "string",
          "znZone": "string",
          "znZoneID": "string"
        }
      ],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'znZoneID',
        value: 'znZone'
      }
    },
    {
      id: 'FMF03',
      fieldName: 'clusters',
      indexField: 'clusters',
      labelName: 'Cluster',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'clusters',
      data: clusterMaster,
      isDataLoaded: true,
      isDynamic: false,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'POST',
      xhrUrl: ApiConstant.getClusterMaster,
      xhrParam: [
        {
          "crClusterID": "string",
          "crName": "string",
          "znZoneID": "string"
        }
      ],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'crClusterID',
        value: 'crName'
      }
    },
    {
      id: 'FMF04',
      fieldName: 'siteId',
      indexField: 'siteId',
      labelName: 'Site Id',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'siteId',
      data: siteCodeMaster,
      isDataLoaded: true,
      isDynamic: false,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'POST',
      xhrUrl: ApiConstant.getSiteCode,
      xhrParam: [
        {
          "code": "string"
        }
      ],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'code',
        value: 'code'
      }
    }
  ];

  public isFilterDataLoaded: boolean = false;
  public isFilterDataLoaded1: boolean = false;
  public alarmStatusList: any = [];
  public alarmCategoryList: any = [];

  private sampleData: any = {};
  private sampleData1: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;

  private filterParam: any = {
    clusters: ['All'],
    customers: ['All'],
    regions: ['All'],
    siteId: ['All'],
    siteStatus: '-1',
    siteType: ['All'],
    zones: ['All']
  };

  private filterParam1: any = {
    categories: ['All']
  };
  private type: any = null;
  private $: any = (window as any)['jQuery'];
  private scrollTimer: any = undefined;
  private scrollAreaHeight = 30;
  private selAlarmCategory: any = null;
  private towerStatusId: any = null;
  private editSub!: Subscription;
  private reqSiteIdObj: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.towerStatusId = paramMap.get('id');
    });
  }

  listen() {
    this.editSub = this.broadcast.on<string>('SET_SELECTED_ROW').subscribe((data: any) => {
      this.selectedRow = data;
      if (data.isForViewDetails) {
        this.viewSiteDetails(data);
      } else if (data.isForLoadOtherDetails) {
        this.loadOtherDetails(data);
      }
    });
  }

  ngOnInit(): void {
    this.init();
    this.bindEvent();
  }

  ngOnDestroy(): void {
    this.$(this.$alarmElem.nativeElement).find('.gbody').unbind('scroll');
    this.editSub.unsubscribe();
  }

  init() {
    this.listen();
    this.loadHourlyReportChart();
    this.loadAlarmCategory();
    this.loadTowerLatestData();
    this.loadAlarmStatusData();
  }

  viewSiteDetails(data?: any) {


    let params: any = { 
      "tabId": "nav-summary-tab", 
      "siteId": "MGT20421A", 
      "series2": null, 
      "series3": null, 
      "series4": null, 
      "series5": null, 
      "series6": null, 
      "series7": null, 
      "reportType": "Daily", 
      "startDate": "", 
      "endDate": "", 
      "dateMonth": "", 
      "dateYear": "" 
    };

    const url = ApiConstant.getSiteSummaryData;

    // if (data && data.smSiteCode) {
    //   params.siteId = data.smSiteCode;
    //   params.smSiteCode = data.smSiteCode
    // }

    const dialogRef = this.dialog.open(SiteDetailsComponent, {
      width: '1000px',
      height: 'auto',
      data: {
        url,
        params
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {

      }
    });
  }

  loadOtherDetails(data?: any) {
    this.reqSiteIdObj = data;
    this.loadAlarmStatusData(data);
    this.loadHourlyReportChart(data);
  }

  dateRangeChange(type: any, evt: any) {
    if (this.range.controls['start'].value && this.range.controls['end'].value) {
      let startDate = moment(this.range.controls['start'].value).format('YYYY-MM-DD');
      let endDate = moment(this.range.controls['end'].value).format('YYYY-MM-DD');
      if (this.reqSiteIdObj) {
        this.reqSiteIdObj.startDate = startDate;
        this.reqSiteIdObj.endDate = endDate;
        this.loadHourlyReportChart(this.reqSiteIdObj);
      } else {
        this.loadHourlyReportChart({ startDate, endDate });
      }
    }
  }

  loadHourlyReportChart(req?: any) {

    let params: any = {
      "allDeviceTypes": true,
      "allSiteId": true,
      "allSiteTypes": true,
      "anyFilterEmpty": true,
      "dataSets": [
        {
          "backgroundColor": "",
          "borderColor": "",
          "data": [""],
          "label": ""
        }
      ],
      "date": "2019/11/27 - 2019/11/28",
      "deviceType": ["All", "Delta", "Li-Lithium", "Lineage", "Statcon"],
      "labels": [
        "All"
      ],
      "siteId": ["MDM01058A"],
      "siteType": ["All", "Hybrid", "TEE"],
      "username": "harish1"
    };

    if (req && req.smSiteCode) {
      params.siteId = [req.smSiteCode]
    }

    if (req && req.startDate && req.endDate) {
      params.date = `${req.startDate} - ${req.endDate}`;
    }


    const url = ApiConstant.getHourlyReport;
    this.httpClient.post(url, params).subscribe((data: any) => {
      console.log(data);
      this.prepareChart(data);
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading hourly report!'
      })
    });
  }

  manipulateChartData(data: any) {
    data.seriesList = [];
    for (let item of data.dataSets) {
      let cssClass = item.label.replace(/\s/g, '-').toLowerCase();
      let obj: any = { className: cssClass, data: item.data };
      data.seriesList.push(obj);
    }
  }

  prepareChart(res: any) {
    this.manipulateChartData(res);
    var chartData = {
      labels: res.labels,
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
      })]
    };

    var responsiveOptions = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value: any) {
            return value[0];
          }
        }
      }]
    ];

    new Chartist.Bar('#websiteViewsChart2', chartData, options, responsiveOptions);
  }

  bindEvent() {
    const self = this;

    const elBody = this.$(this.$alarmElem.nativeElement).find('.gbody');
    this.$(this.$alarmElem.nativeElement).find('.gbody').unbind('scroll').bind('scroll', () => {
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

  loadAlarmCategory() {
    const url = ApiConstant.getAlarmCategory;
    this.httpClient.get(url).subscribe((data: any) => {
      this.alarmCategoryList = data;
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error While Loading Alarm Category List!'
      })
    });
  }

  toggle(evt?: any) {
    this.isAlarmCategoryOpen = !this.isAlarmCategoryOpen;
  }

  selectCategory(evt?: any, item?: any) {
    this.isAlarmCategoryOpen = false;
    this.selAlarmCategory = item;
    if (this.reqSiteIdObj) {
      this.reqSiteIdObj.alarmSelCategory = item;
      this.loadAlarmStatusData(this.reqSiteIdObj);
    } else {
      let obj: any = { alarmSelCategory: item };
      this.loadAlarmStatusData(obj);
    }
  }

  doFilter(evt?: any) {

  }

  loadAlarmStatusData(req?: any) {
    if (this.isAlarmStatusLoading) {
      return;
    }
    this.isAlarmStatusLoading = true;
    const url = ApiConstant.getAlarmStatus;
    let paramData: any = {
      "all": "string",
      "allCategory": true,
      "allSeverity": true,
      "allSiteId": true,
      "anyFilterEmpty": true,
      "categories": ["All", "Battery", "Hybrid", "Super Critical"],
      "severities": [
        "All"
      ],
      "siteId": [
        "All"
      ],
      "username": "harish1"
    };

    if (req && req.smSiteCode) {
      paramData.siteId = [req.smSiteCode]
    }

    if (req && req.alarmSelCategory) {
      paramData.categories = [req.alarmSelCategory.category];
    }

    this.httpClient.post(url, paramData).subscribe((data: any) => {
      this.isAlarmStatusLoading = false;
      this.alarmStatusList = data;
      this.manipulateAlarmStatusData(data.data);
    }, (err) => {
      this.isAlarmStatusLoading = false;
      this.isAlarmStatusListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Alarm Status Details!'
      })
    });
  }

  manipulateAlarmStatusData(data: any) {

  }

  loadTowerLatestData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    const url = ApiConstant.getLatestData;
    this.httpClient.get(url).subscribe((data: any) => {
      this.isLoading = false;
      this.manipulate(data.data);
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Tower Latest Details!'
      })
    });
  }

  manipulate(data: any) {
    this.setResponse(data);
    this.setColumnHeader(data);
    this.setRowData(data);
    this.activeListing.list = this.sampleData;
  }

  setResponse(resData: any) {
    this.sampleData.currentPageNo = this.currentPageNo + 1;
    this.sampleData.listingType = AppConstant.LATEST_DATA1_LISTING_TYPE;
    this.sampleData.recordBatchSize = 50 || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.sortField = 'smSiteCode';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
    this.sampleData.totalDocs = resData.totalElements || resData.length;
  }

  setColumnHeader(resData: any) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      // this.sampleData.columnHeader.push(LATEST_DATA1_COLUMN_HEADER['checkbox']);
      for (let key in rowData) {
        if (TOWER_STATUS_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(TOWER_STATUS_COLUMN_HEADER[key]);
        }
      }
    }
  }

  setRowData(resData: any) {
    const data = resData || [];
    if (data.length) {
      if (this.towerStatusId === "3") {
        this.sampleData.data = data;
      } else {
        this.sampleData.data = data.filter((item?: any) => {
          if (this.towerStatusId === "1" && item.isOffline === 0) {
            return item;
          } else if (this.towerStatusId === "2" && item.isOffline === 1) {
            return item;
          }
        });
      }
    } else {
      this.sampleData.data = [];
    }
  }

  openFilter(evt?: any) {
    this.isReqToOpenFilter = !this.isReqToOpenFilter;
  }

  openFilterAlarmStatus(evt?: any) {
    this.isReqToOpenAlarmStatusFilter = !this.isReqToOpenAlarmStatusFilter;
  }

  onFilterChange(evt?: any) {

  }

  openTabular(evt?: any) {
    this.isExpanded = !this.isExpanded;
  }

  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }

  openAlarmStatusFilter(evt?: any) {
    this.isOpenAlarmStatusFilter = !this.isOpenAlarmStatusFilter;
  }

  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
  }

  applyTowerStatusFilter(evt?: any) {
    this.isReqToOpenAlarmStatusFilter = false;
  }

  updateListParam(data: any) {
    this.currentPageNo = data.currentPageNo ? (data.currentPageNo - 1) : this.currentPageNo;
    this.pageSize = data.pageSize || this.pageSize;
    this.recordStartFrom = data.recordStartFrom || this.recordStartFrom;

    if (data && data.popupTo) {
      this.applyFilter(data);
    } else {
      this.loadTowerLatestData();
    }
  }

  loadListing(data: any) {
    this.updateListParam(data);
  }

  onRowSelectionChanged(data: any) {
    if (data && data.length) {
      this.isMultipleRowSelected = data.length > 1;
      this.multipleSelRow = data;
      if (this.isMultipleRowSelected) {
        // custom business logic
      } else {
        this.selectedRow = data;
      }
    } else {
      this.multipleSelRow = null;
      this.selectedRow = null;
    }
  }

}
