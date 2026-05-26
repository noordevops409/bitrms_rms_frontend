import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';

import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';
import { engineerNameList } from '../data/engineerName';
import { customerMaster } from '../data/customer-master';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';
import * as moment from 'moment';
import { BATT_LIFE_REPORTS_COLUMN_HEADER } from './battery-life-cycle-reports-column.enum';

@Component({
  selector: 'app-battery-life-cycle-reports',
  templateUrl: './battery-life-cycle-reports.component.html',
  styleUrls: ['./battery-life-cycle-reports.component.scss']
})
export class BatteryLifeCycleReportsComponent implements OnInit {

  @ViewChild(TableListingComponent, { static: true }) public tableListingComponent!: TableListingComponent;

  public isLoading: boolean = false;
  public isListServerError: boolean = false;

  public parentHeight: any = null;
  public selectedRow: any = null;
  public multipleSelRow: any = null;
  public list = [];
  public appType: Number = AppConstant.LATEST_DATA1_APP_TYPE;

  public activeListing: any = {};
  public data: any;
  public listingTemplate: any = {};

  isReqToOpenFilter: boolean = false;
  isOpenTabularFilter: boolean = false;
  isExpanded: boolean = false;
  changeUrl:boolean=false;
  isExporting: boolean = false;
  public viewType: string = '';
  public viewTitle: string = 'Battery Life Cycle Reports';

  private sampleData: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  private allData: any = {};
 

  private filterParam: any = {
    "siteId": ['All'],
    "clusters": ['All'],
    "zones": ['All'],
    "regions": ['All'],
    "deviceType": ['All'],
    "siteType": ['All'],
    "siteStatus": ['All'],
    "customers": ['All'],
    "engineer": ['All'],
    "date": null,
    "startDate": "",
    "endDate": ""
  };

  defaultFilterList: any = [
    {
      id: 'FMF04',
      fieldName: 'siteId',
      indexField: 'siteId',
      labelName: 'Site Code',
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
    // {
    //   id: 'FMF05',
    //   fieldName: 'regions',
    //   indexField: 'regions',
    //   labelName: 'Region',
    //   dataType: 'Dropdown',
    //   popupTo: {
    //     recordBatchSize: 25,
    //     data: []
    //   },
    //   listingColumnFieldName: 'regions',
    //   data: [],
    //   isDataLoaded: false,
    //   isDynamic: true,
    //   isOpen: false,
    //   isReqRemove: false,
    //   xhrMethod: 'GET',
    //   xhrUrl: ApiConstant.getRegionMaster,
    //   xhrParam: [],
    //   isReqManipulate: true,
    //   isAllDataLoaded: true,
    //   maniObj: {
    //     id: 'rgRegion',
    //     value: 'rgRegion'
    //   }
    // },
    {
      id: 'FMF06',
      fieldName: 'clusters',
      indexField: 'clusters',
      labelName: 'Cluster',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'clusters',
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
      xhrUrl: ApiConstant.getClusterMaster,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'crName',
        value: 'crName'
      }
    }
  ];

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    console.log('BatteryLifeCycleReportsComponent - defaultFilterList:', this.defaultFilterList);
    this.route.data.subscribe((data: any) => {
      this.viewType = data.viewType || '';
      if (this.viewType === 'daily') {
        this.viewTitle = 'Daily Battery Life Cycle Reports';
      } else if (this.viewType === 'monthly') {
        this.viewTitle = 'Monthly Battery Life Cycle Reports';
      } else if (this.viewType === 'yearly') {
        this.viewTitle = 'Yearly Battery Life Cycle Reports';
      } else {
        this.viewTitle = 'Battery Life Cycle Reports';
      }
      this.init();
    });
  }


  init() {
    // this.loadData();
  }


  setDefaultFilter() {
    this.filterParam = {
      "siteId": ['All'],
      "clusters": ['All'],
      "zones": ['All'],
      "regions": ['All'],
      "deviceType": ['All'],
      "siteType": ['All'],
      "siteStatus": ['All'],
      "customers": ['All'],
      "engineer": ['All'],
      "date": null,
    };
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    
    this.sampleData = {};
    this.activeListing = {};
    this.allData = {};
    
    setTimeout(() => {
      if (this.tableListingComponent) {
        this.tableListingComponent.init();
      }
    });
    let url = '';
    if (this.viewType === 'daily') {
      url = ApiConstant.getDailyBattLifeCycle;
    } else if (this.viewType === 'monthly') {
      url = ApiConstant.getMonthlyBattLifeCycle;
    } else if (this.viewType === 'yearly') {
      url = ApiConstant.getYearlyBattLifeCycle;
    } else {
      console.error("Invalid viewType:", this.viewType);
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Invalid view type. Please navigate to Daily, Monthly, or Yearly reports.'
      });
      return;
    }
    
    this.httpClient.post(url, this.filterParam).subscribe((data: any) => {
      this.manipulate(data);
      this.isLoading = false;
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Battery Life Cycle Reports details!'
      })
    });
  }

  manipulate(data) {
    let transformedData = data.data;
    if (data.data && data.data.length > 0 && Array.isArray(data.data[0])) {
      transformedData = this.transformArrayToObjects(data.data);
    }
    
    this.setResponse(transformedData);
    this.setColumnHeader(transformedData);
    this.setRowData(transformedData);
    this.activeListing.list = this.sampleData;
  }

  transformArrayToObjects(arrayData) {
    const fieldNames = [
      'srno', 'siteId', 'region', 'regionName', 'cluster', 'siteCode', 'siteName', 
      'customerId', 'customerName', 'siteTypeId', 'siteTypeName', 'powerSourceId', 
      'powerSourceName', 'reportDate', 'reportMonth', 'reportYear', 'startDateTime', 
      'endDateTime', 'initialBatteryLifeCycleCount', 'finalBatteryLifeCycleCount', 
      'totalBatteryCycleLifeCount'
    ];

    return arrayData.map((row, index) => {
      const obj: any = {};
      fieldNames.forEach((fieldName, i) => {
        obj[fieldName] = row[i] || '';
      });
      return obj;
    });
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo + 1;
    this.sampleData.listingType = AppConstant.BATT_LIFE_LISTING_TYPE;
    this.sampleData.recordBatchSize = 10;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.sortField = 'smSiteID';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
    this.sampleData.totalDocs = resData.totalElements || resData.length;
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      for (let key in rowData) {
        if (key !== 'srno' && key !== 'region' && key !== 'regionName' && BATT_LIFE_REPORTS_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(BATT_LIFE_REPORTS_COLUMN_HEADER[key]);
        }
      }
    }
  }

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        counter += 1;
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
    let startDate = "";
    let endDate = "";
    let regions: any = ["All"];
    let zones: any = ["All"];
    let clusters: any = ["All"];
    let siteId: any = ["All"];
    let deviceType: any = ["All"];
    let siteType: any = ["All"];
    let siteStatus: any = null;
    let customer: any = ["All"];
    let engineer: any = ["All"];
    let rangeDate: any = null;

    if (fData && fData.length) {
      if (fData[0] && fData[0].popupTo && fData[0].popupTo.data && fData[0].popupTo.data.length) {
        siteId = fData[0].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[1] && fData[1].popupTo && fData[1].popupTo.data && fData[1].popupTo.data.length) {
        regions = fData[1].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[2] && fData[2].popupTo && fData[2].popupTo.data && fData[2].popupTo.data.length) {
        clusters = fData[2].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[3] && fData[3].length) {
        siteType = fData[3].filter((item) => {
          return item.isChecked && item.text;
        }).map((item) => {
          return item.text;
        });
      }

      if (fData[4] && fData[4].startDate !== null && fData[4].endDate !== null) {
        startDate = fData[4].startDate.replace(/-/g, '/');
        endDate = fData[4].endDate.replace(/-/g, '/');
        rangeDate = startDate + ' - ' + endDate;
      } else {
        startDate = "";
        endDate = "";
        rangeDate = null;
      }
    }

    this.filterParam = {
      "siteId": siteId,
      "clusters": clusters,
      "zones": zones,
      "regions": regions,
      "deviceType": deviceType,
      "siteStatus": siteStatus ? [siteStatus] : ['All'],
      "siteType": siteType.length === 0 ? ['All'] : siteType,
      "customers": customer.length === 0 ? ['All'] : customer,
      "engineer": engineer.length === 0 ? ['All'] : engineer,
      "date": rangeDate,
      "startDate": startDate,
      "endDate": endDate
    };
  }

  applyFilter(fData: any) {
    this.isOpenTabularFilter = false;
    if (fData) {
      this.setFilterParam(fData);
    } else {
      this.setDefaultFilter();
    }
    this.isLoading = false;
    this.loadData();
  }

  exportTableToExcel(type: string): void {
    this.isExporting = true;
    setTimeout(() => {
      let element = document.getElementById('export-data');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      let filename = 'battery-life-cycle-reports';
      if (this.viewType) {
        filename = `${this.viewType}-battery-life-cycle-reports`;
      }
      XLSX.writeFile(wb, `${filename}.${type}`);
      
      this.isExporting = false;
    }, 100);
  }

  exportExcel(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.exportTableToExcel('xlsx');
  }

  exportCSV(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.exportTableToExcel('csv');
  }

  onRowSelectionChanged(event: any) {
  }

  updateListParam(data) {
    this.currentPageNo = data.currentPageNo ? (data.currentPageNo - 1) : this.currentPageNo;
    this.pageSize = data.pageSize || this.pageSize;
    this.recordStartFrom = data.recordStartFrom || this.recordStartFrom;

    if (data && data.popupTo) {
      this.applyFilter(data);
    } else {
      this.loadData();
    }
  }

  loadListing(data) {
    this.updateListParam(data);
  }

  searchGlobally(event: any) {
    let { value } = event.target;
    value = value.toUpperCase();
    if (value) {
      this.sampleData.data = this.allData.data.filter((item) => {
        return (
          (item.siteId && item.siteId.toString().toUpperCase().includes(value)) ||
          (item.siteCode && item.siteCode.toString().toUpperCase().includes(value)) ||
          (item.siteName && item.siteName.toString().toUpperCase().includes(value)) ||
          (item.customerName && item.customerName.toString().toUpperCase().includes(value)) ||
          (item.region && item.region.toString().toUpperCase().includes(value)) ||
          (item.cluster && item.cluster.toString().toUpperCase().includes(value))
        );
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    setTimeout(() => {
      this.tableListingComponent.init();
    });
  }
}
