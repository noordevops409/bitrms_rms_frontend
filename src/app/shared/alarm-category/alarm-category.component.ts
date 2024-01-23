import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';

import { engineerNameList } from '../../pages/data/engineerName';
import { customerMaster } from '../../pages/data/customer-master';
import { ALARM_CATEGORY_COLUMN_HEADER } from './alarm-category-column.enum';

import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';
import * as moment from 'moment';

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
  public index = 1;
  public listingTemplate: any = {};

  public isReqToOpenFilter: boolean = false;
  public isOpenTabularFilter: boolean = false;
  public isExpanded: boolean = false;
  public superCriticalAlertsCount: any;
  public isClickable1 :boolean=false;
  public alertsClicked :boolean=false;
  public superCritical:any;
  public loadedData: any[] = []; // Initialize loadedData as an empty array
  public alertType:any;


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
    },
    {
      id: 'FMF06',
      fieldName: 'customers',
      indexField: 'customers',
      labelName: 'Customer',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'customers',
      data: customerMaster,
      isDataLoaded: true,
      isDynamic: false,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
      xhrUrl: null,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'id',
        value: 'value'
      }
    },
    {
      id: 'FMF07',
      fieldName: 'engineerName',
      indexField: 'engineerName',
      labelName: 'Engineer',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'engineerName',
      data: engineerNameList,
      isDataLoaded: true,
      isDynamic: false,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
      xhrUrl: null,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'id',
        value: 'value'
      }
    }
  ];

  public isFilterDataLoaded: boolean = false;
  public siteData: any = null;
  public siteId: any = null;
  public alarmCounts: any = [];
  public alertsCounts: any = [];

  public ddExport: any = "-1";
  public exportData: any = {
    data: []
  };
  public isExporting: boolean = false;

  private countryList: any = [];
  private sampleData: any = {};
  private allData: any = {};
  private currentPageNo: number = 1;
  private pageSize: number = 100;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  private forEditListener!: Subscription;
  private forDeleteListener!: Subscription;
  selectedAlert: any; // Replace 'any' with the appropriate type of your 'alertsCounts' items
  isTableVisible: boolean = false;

  private filterParam: any = {
    "categories": ["All"],
    "siteId": ["All"],
    "deviceType": ["All"],
    "regions": ["All"],
    "zones": ["All"],
    "customers": ['All'],
    "engineer": ['All'],
    "siteType": ["All"],
    "date": null,
    "alarmStatus": ["All"],
    "siteStatus": ['All'],
    "all": "ALL",
    "allAlarmStatus": true,
    "allCustomers": true,
    "allDeviceType": true,
    "allRegions": true,
    "allSiteId": true,
    "allSiteType": true,
    "anyFilterEmpty": true
  };
  private dashboardChartFilter: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.siteId = paramMap.get('siteId');
    });
  }

  ngOnInit(): void {
   //  let startDate = moment().add(-1, 'days').format('YYYY/MM/DD');
    // let endDate = moment().add(-1, 'days').format('YYYY/MM/DD');
   //  this.filterParam.date = `${startDate} 00:00:00 - ${endDate} 23:59:00`;
    this.init();
    this.listen();
  }

  ngOnDestroy(): void {
  }

  init() {
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.initFilterParam();
    this.setDefaultFilter();
    this.dashboardChartFilter = this.util.getDashboardAlarmStatusChartFilter();
    if (this.dashboardChartFilter) {
      const groupBy = this.dashboardChartFilter.groupBy;
      const groupValue = this.dashboardChartFilter.groupValue;
      this.filterParam[groupBy] = [groupValue];
      this.util.setDashboardAlarmStatusChartFilter(null);
    }
    this.loadData();
    this.loadSummaryCounts();
    this.loadAlertsCounts();
  }

  initFilterParam() {
    let startDate = moment().add(-2, 'days').format('YYYY/MM/DD');
    let endDate = moment().add(-1, 'days').format('YYYY/MM/DD');
    this.filterParam = {
      "categories": ["All"],
      "siteId": ["All"],
      "deviceType": ["All"],
      "regions": ["All"],
      "zones": ["All"],
      "customers": ['All'],
      "engineer": ['All'],
      "siteType": ["All"],
      "date": `${startDate} 00:00:00 - ${endDate} 23:59:00`,
      "alarmStatus": ["All"],
      "siteStatus": ['All'],
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

  listen() {
    this.broadcast.on<string>('OPEN_REGION_FOR_EDIT').subscribe((data: any) => {
      this.ngZone.run(() => {
        // this.edit(null, data);
      });
    });
  }

  setDefaultFilter() {
    this.initFilterParam();
    if (this.siteId) {
      this.filterParam.siteId = [this.siteId];
      this.filterParam.date=null;
    } else {
      this.filterParam.siteId = ["All"];
    }
    //console.log("urllll",window.location.href);

  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.getAlarmData + `?page=${this.currentPageNo}&size=${this.pageSize}`;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.post(apiUrl, this.filterParam).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.data ) {
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

  loadAllData() {
    return new Promise((resolve, reject) => {
      let list: any = [];
      let pageSize = 100;
      let getAll = () => {
        let apiUrl: any = ApiConstant.getAlarmData + `?page=${this.currentPageNo}&size=${pageSize}`;
        this.httpClient.post(apiUrl, this.filterParam).subscribe((res: any) => {
          if (res.data && res.data.length) {
            list.push(...res.data);
          } else {
            res.data = list;
            this.currentPageNo = 1;
            pageSize = 10;
            resolve(res);
            return;
          }
          this.currentPageNo += 1;
          pageSize = Math.min(100, (res.totalCount - list.length));
          if (res.totalCount === list.length) {
            res.data = list;
            this.currentPageNo = 1;
            pageSize = 10;
            resolve(res);
            return;
          } else {
            getAll();
          }
        }, (err: any) => {
          reject(err);
        });
      }
      getAll();
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
    let alarmStatus: any = null;
    let customer: any = ["All"];
    let engineer: any = ["All"];
    let rangeDate: any = "";


    if (fData && fData.length) {
      if (fData[0].popupTo.data && fData[0].popupTo.data.length) {
        regions = fData[0].popupTo.data.map((item) => {
          return item.id;
        });
      }


      if (fData[1].popupTo.data && fData[1].popupTo.data.length) {
        zones = fData[1].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[2].popupTo.data && fData[2].popupTo.data.length) {
        siteId = fData[2].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[3].popupTo.data && fData[3].popupTo.data.length) {
        deviceType = fData[3].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[4].popupTo.data && fData[4].popupTo.data.length) {
        categories = fData[4].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[5].popupTo.data && fData[5].popupTo.data.length) {
        customer = fData[5].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[6].popupTo.data && fData[6].popupTo.data.length) {
        engineer = fData[6].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[7] && fData[7].length) {
        siteType = fData[7].filter((item) => {
          return item.isChecked && item.text;
        }).map((item) => {
          return item.text;
        });
      }

      alarmStatus = fData[8];
      // if (alarmStatus) {
      //   if (alarmStatus == '1') {
      //     alarmStatus = 'Open'
      //   } else if (alarmStatus == '0') {
      //     alarmStatus = 'Close';
      //   } else {
      //     alarmStatus = 'All';
      //   }
      // }
      if (fData[9] && fData[9].startDate && fData[9].endDate) {
        rangeDate = fData[9].startDate.replace(/-/g, '/') + ' - ' + fData[9].endDate.replace(/-/g, '/');
      } else {
        let startDate = moment().add(-2, 'days').format('YYYY/MM/DD');
        let endDate = moment().add(-1, 'days').format('YYYY/MM/DD')
        rangeDate = `${startDate} 00:00:00 - ${endDate} 23:59:00`;
      }
    }
    this.filterParam = {
      "categories": categories,
      "siteId": siteId,
      "deviceType": deviceType,
      "regions": regions,
      "zones": zones,
      "siteStatus": ['All'],
      "siteType": siteType.length === 0 ? ['All'] : siteType,
      "customers": customer.length === 0 ? ['All'] : customer,
      "engineer": engineer.length === 0 ? ['All'] : engineer,
      "date": rangeDate,
      "alarmStatus": alarmStatus ? [alarmStatus] : ['All'],
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

  
 loadDataByType(item) {
  this.isLoading = true;
  this.alertsClicked=true;
  let apiUrl: any = `${ApiConstant.getServrityAlarm}/${item}`;
  // (window as any)['retainNoOfShow'] = this.pageSize;
  this.loadedData = [];
this.alertType=item;
  this.httpClient.get(apiUrl).subscribe((res: any) => {
    //console.log("line 681", res);
    if (res && res.data && res.data.length) {
      this.manipulate(res);
      setTimeout(() => {
        this.tableListingComponent.init();
        this.isLoading = false; // Set isLoading to false after data is bound to the table.
      });
    } else {
      this.isLoading = false; // Set isLoading to false if no data is available.
      this.isListServerError = false; // Reset error flag if data is successfully loaded.
    }
  }, (err) => {
    this.isLoading = false; // Set isLoading to false in case of an error.
    this.isListServerError = true;
    this.util.notification.error({
      title: 'Error',
      msg: 'Error while loading alarm category details!'
    });
  });
}

loadAllDataAlerts(alertType) {
  return new Promise((resolve, reject) => {
    let list: any = [];

    let getAll = () => {
      let apiUrl: any = `${ApiConstant.getServrityAlarm}/${alertType}`;
      this.httpClient.get(apiUrl).subscribe((res: any) => {
        if (res.data && res.data.length) {
          list.push(...res.data);
        } else {
          res.data = list;
          resolve(res);
          return;
        }
        if (res.totalCount === list.length) {
          res.data = list;
          resolve(res);
          return;
        } else {
          getAll();
        }
      }, (err: any) => {
        reject(err);
      });
    }
    getAll();
  });
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
    this.isExporting = false;

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

  exportOptSelected(evt?: any) {
    evt.stopPropagation();
    evt.preventDefault();
    this.isExporting = false;
    if (this.exportData.data.length === 0 && this.alertsClicked==false ) {
      this.loadAllData().then((res: any) => {
        this.exportData.data = res.data;
       // console.log("717line", this.exportData.data);
        setTimeout(() => {
          let selVal = this.ddExport;
          if (selVal === "1") {
            this.exportExcel(evt);
          } else if (selVal === "2") {
            this.exportCSV(evt);
          }
        }, 500);
      }).catch((err: any) => {

      })
    }else if(this.exportData.data.length === 0 && this.alertsClicked==true)
    {
      this.loadAllDataAlerts(this.alertType).then((res: any) => {
        this.exportData.data = res.data;
        //console.log("717line", this.exportData.data);
        setTimeout(() => {
          let selVal = this.ddExport;
          if (selVal === "1") {
            this.exportExcel(evt);
          } else if (selVal === "2") {
            this.exportCSV(evt);
          }
        }, 500);
      }).catch((err: any) => {

      })
    }
     else {
      setTimeout(() => {
        let selVal = this.ddExport;
        if (selVal === "1") {
          this.exportExcel(evt);
        } else if (selVal === "2") {
          this.exportCSV(evt);
        }
      }, 500);
    }
  }

  searchGlobally(event) {
    let { value } = event.target;
    value = value.toLowerCase();
    if (value) {
      this.sampleData.data = this.allData.data.filter((item) => {
        if (item.smsiteCode || item.alName) {
          return item.smsiteCode.toLowerCase().includes(value) ||
            item.alName.toLowerCase().includes(value);
        }
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }

  loadAlertsCounts() {
    let apiUrl: any = ApiConstant.getAlertsCounts;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.get(apiUrl).subscribe((res: any) => {
      // Initialize the list with all alerts and default count 0
      let list: any[] = [
        { type: "fuellvl", count: 0, cssClass: 'btn-danger', isClickable: false },
        { type: "dcload", count: 0, cssClass: 'btn-warning', isClickable: false },
        { type: "dgcount", count: 0, cssClass: 'btn-default', isClickable: false },
        { type: "Run hours", count: 0, cssClass: 'btn-primary', isClickable: false }
      ];

      if (res && res.length) {
          for (let item of res) {
            let obj: any = {
              type: item[0],
              count: item[1],
              cssClass: '',
              isClickable: item[1] > 0 // Set isClickable to true if count is greater than 0
            };

          // Update the corresponding alert count and cssClass from the API response
          const index = list.findIndex(alert => alert.type === obj.type);
          if (index !== -1) {
            list[index].count = obj.count;
            // Set the appropriate CSS class based on the type (you can customize this logic)
            if (obj.type === 'fuellvl') {
              list[index].cssClass = 'btn-danger';
            } else if (obj.type === 'dcload') {
              list[index].cssClass = 'btn-warning';
            } else if (obj.type === 'dgcount') {
              list[index].cssClass = 'btn-default';
            } else if (obj.type === 'Run hours') {
              list[index].cssClass = 'btn-primary';
            }
            // Update the isClickable property based on the count value
            list[index].isClickable = obj.count > 0;
          }
        }
      }

      // Set the updated list to alertsCounts
      this.alertsCounts = list;
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading alarm summary count details!'
      });
    });

    let apiUrl1: any = ApiConstant.getSuperCriticalAlertsCounts;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.get(apiUrl1).subscribe((res: any) => {
      

      if (res === 0) {
       // console.log('super critical alerts counts: 0');
        this.superCriticalAlertsCount = 0;
      this.isClickable1=true;
      this.superCritical="Community Load"
      } else {
       // console.log('super critical alerts counts: ', JSON.stringify(res));
        this.superCriticalAlertsCount = res;
       this.isClickable1=true;
       this.superCritical="Community Load"


      }
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading alarm summary count details!'
      });
    });
  }

  openTabular(type?: any) {
    this.router.navigate(['alerts-table', type], {
      relativeTo: this.activatedRoute.parent
    });
    // this.router.navigate(['pages', 'alarm-status','alerts-table', type]);
//console.log('alertType', type);
  }
  openTabular1(evt?: any) {
    this.router.navigate(['alerts-table',this.superCritical], {
      relativeTo: this.activatedRoute.parent
    });
    // this.router.navigate(['pages', 'alarm-status','alerts-table', type]);
    //console.log('alertType', type);
  
  }

}
