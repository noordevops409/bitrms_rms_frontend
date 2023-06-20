import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';

import { ALARM_CATEGORY_COLUMN_HEADER } from './alarm-category-column.enum';

import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';

@Component({
  selector: 'app-alarm-category',
  templateUrl: './alarm-category.component.html',
  styleUrls: ['./alarm-category.component.scss']
})
export class AlarmCategoryComponent implements OnInit, OnDestroy {

  @ViewChild(TableListingComponent, { static: true }) public tableListingComponent!: TableListingComponent;

  public isLoading: boolean = false;
  public isListServerError: boolean = false;

  public parentHeight: any = null;
  public selectedRow: any = null;
  public multipleSelRow: any = null;
  public list = [];
  public appType: Number = AppConstant.RAW_DATA_REPORT_APP_TYPE;

  public activeListing: any = {};
  public data: any;
  public listingTemplate: any = {};

  public isReqToOpenFilter: boolean = false;
  public isOpenTabularFilter: boolean = false;
  public isExpanded: boolean = false;

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
      xhrMethod: 'GET',
      xhrUrl: ApiConstant.getRegionMaster,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'rgRegion',
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
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
      xhrUrl: ApiConstant.getZoneMaster,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'znZone',
        value: 'znZone'
      }
    },
    {
      id: 'FMF03',
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
      id: 'FMF04',
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
    },
    {
      id: 'FMF05',
      fieldName: 'categories',
      indexField: 'categories',
      labelName: 'Category',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'categories',
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
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

  public isFilterDataLoaded: boolean = false;
  public siteData: any = null;
  public siteId: any = null;
  public alarmCounts: any = [];

  private countryList: any = [];
  private sampleData: any = {};
  private allData: any = {};
  private currentPageNo: number = 1;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  private forEditListener!: Subscription;
  private forDeleteListener!: Subscription;

  private filterParam: any = {
    "categories": ["All"],
    "siteId": ["All"],
    "deviceType": ["All"],
    "regions": ["All"],
    "zones": ["All"],
    "customers": ["All"],
    "siteType": ["All"],
    "date": "2023/06/14 - 2023/06/15",
    "alarmStatus": ["All"],
    "all": "ALL",
    "allAlarmStatus": true,
    "allCustomers": true,
    "allDeviceType": true,
    "allRegions": true,
    "allSiteId": true,
    "allSiteType": true,
    "anyFilterEmpty": true
  };

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ngZone: NgZone
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.siteId = paramMap.get('siteId');
    });
  }

  ngOnInit(): void {
    this.init();
    this.listen();
  }

  ngOnDestroy(): void {
  }

  init() {
    this.setDefaultFilter();
    this.loadData();
    this.loadSummaryCounts();
  }

  listen() {
    this.broadcast.on<string>('OPEN_REGION_FOR_EDIT').subscribe((data: any) => {
      this.ngZone.run(() => {
        // this.edit(null, data);
      });
    });
  }

  setDefaultFilter() {
    if (this.siteId) {
      this.filterParam.siteId = [this.siteId];
    } else {
      this.filterParam.siteId = ["MGT20711A"];
    }
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.getAlarmData;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.post(apiUrl, this.filterParam).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.data && res.data.length) {
        this.manipulate(res);
        setTimeout(() => {
          this.tableListingComponent.init();
        });
      }
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading alarm category details!'
      })
    });
  }

  loadSummaryCounts() {
    let apiUrl: any = ApiConstant.getAlarmSummaryCount;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.get(apiUrl).subscribe((res: any) => {
      if (res && res.length) {
        let list: any = [];
        for (let item of res) {
          let obj: any = {
            type: item[0],
            count: item[1]
          };
          if (obj.type === 'Critical') {
            obj.cssClass = 'btn-danger';
          } else if (obj.type === 'Major') {
            obj.cssClass = 'btn-warning';
          } else if (obj.type === 'Minor') {
            obj.cssClass = 'btn-default';
          }
          list.push(obj);
        }
        this.alarmCounts = list;
      }

    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading alarm summary count details!'
      })
    });
  }

  manipulate(res) {
    this.setResponse(res.data);
    this.setColumnHeader(res.data);
    this.setRowData(res.data);
    this.activeListing.list = this.sampleData;
    this.sampleData.totalDocs = res.totalCount || res.data.length;
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo;
    this.sampleData.listingType = AppConstant.ALARM_STATUS_LISTING_TYPE;
    this.sampleData.recordBatchSize = this.pageSize || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.retainNoOfShow = this.pageSize;
    this.sampleData.sortField = 'alrid';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      this.sampleData.columnHeader.push(ALARM_CATEGORY_COLUMN_HEADER['srno']);
      for (let key in rowData) {
        if (key === 'ageing') {
          this.sampleData.columnHeader.push(ALARM_CATEGORY_COLUMN_HEADER['elapsedTime']);
        } else if (ALARM_CATEGORY_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(ALARM_CATEGORY_COLUMN_HEADER[key]);
        }
      }
    }
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

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        counter += 1;
        item.elapsedTime = this.secondsToDhms(item.ageing);
        item.srno = counter;
      }
      this.sampleData.data = data;
      this.allData.data = data;
    } else {
      this.sampleData.data = [];
      this.allData.data = [];
    }
  }

  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }

  setFilterParam(fData) {
    let categories: any = ["All"];
    let regions: any = ["All"];
    let zones: any = ["All"];
    let clusters: any = ["All"];
    let siteId: any = ["All"];
    let deviceType: any = ["All"];
    let siteType: any = ["All"];
    let severities: any = [];
    let siteStatus: any = null;
    let customer: any = [];
    let rangeDate: any = "";


    if (fData && fData.length) {
      regions = fData[0].popupTo.data.map((item) => {
        return item.id;
      });

      zones = fData[1].popupTo.data.map((item) => {
        return item.id;
      });

      deviceType = fData[2].popupTo.data.map((item) => {
        return item.id;
      });

      siteId = fData[3].popupTo.data.map((item) => {
        return item.id;
      });

      categories = fData[4].popupTo.data.map((item) => {
        return item.id;
      });

      siteType = fData[5].filter((item) => {
        return item.isChecked && item.text;
      }).map((item) => {
        return item.text;
      });

      if (fData[6] && fData[6].startDate && fData[6].endDate) {
        rangeDate = fData[6].startDate.replace(/-/g, '/') + ' - ' + fData[6].endDate.replace(/-/g, '/');
      }

      customer = fData[8].filter((item) => {
        return item.isChecked && item.text;
      }).map((item) => {
        return item.text;
      });
    }
    this.filterParam = {
      "categories": categories,
      "siteId": siteId,
      "deviceType": deviceType,
      "regions": regions,
      "zones": zones,
      "customers": customer,
      "siteType": siteType,
      "date": rangeDate,
      "alarmStatus": ["All"],
      "all": "ALL",
      "allAlarmStatus": true,
      "allCustomers": true,
      "allDeviceType": true,
      "allRegions": true,
      "allSiteId": true,
      "allSiteType": true,
      "anyFilterEmpty": true
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
    this.loadData();
  }

  updateListParam(data) {
    this.currentPageNo = data.currentPageNo ? (data.currentPageNo) : this.currentPageNo;
    this.pageSize = data.pageSize || this.pageSize;
    this.recordStartFrom = data.recordStartFrom || this.recordStartFrom;

    if (data && data.popupTo) {
      this.applyFilter(data);
    } else {
      this.loadData();
    }
  }

  loadDataByType(evt?: any, item?: any) {

  }

  loadListing(data) {
    this.updateListParam(data);
  }

  onRowSelectionChanged(data) {
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

  exportTableToExcel(type: string): void {
    /* pass here the table id */
    let element = document.getElementById('export-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `alarm-status-data.${type}`);

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

  searchGlobally(event) {
    let { value } = event.target;
    value = value.toLowerCase();
    if (value) {
      this.sampleData.data = this.allData.data.filter((item) => {
        if (!!item.smSiteCode && !!item.alName) {
          return (item.smSiteCode.includes(value) || item.alName.includes(value))
        }
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }

}
