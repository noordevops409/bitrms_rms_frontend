import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';

import * as XLSX from 'xlsx';

import { engineerNameList } from '../../data/engineerName';
import { customerMaster } from '../../data/customer-master';
import { TOWER_STATUS_COLUMN_HEADER } from '../tower-status-column.enum';
// import { ALARM_STATUS_COLUMN_HEADER } from './alarm-status-column.enum';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';

import * as Chartist from 'chartist';

import 'chartist-plugin-tooltips';
import 'chartist-plugin-legend';
import 'chartist-plugin-pointlabels';
// import 'chartist-plugin-barlabels';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';
import { ImgPreviewComponent } from '../img-preview/img-preview.component';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit, OnDestroy {

  @ViewChild(TableListingComponent, { static: true }) public tableListingComponent!: TableListingComponent;

  public isLoading: boolean = false;
  public isListServerError: boolean = false;

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

  public latestReportStatus: any = null;
  public ddExport: any = "-1";

  isReqToOpenFilter: boolean = false;
  isOpenTabularFilter: boolean = false;
  isExpanded: boolean = false;
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
      id: 'FMF05',
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
  public isFilterDataLoaded1: boolean = false;
  public totalAlarmCatCount: any = 0;

  private allData: any = {};
  private sampleData: any = {};
  private sampleData1: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;

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
    "date": null
  };
  private hasFilterData: boolean = false;
  private type: any = null;
  private forImgPreview!: Subscription;
  private ageLimit: any = 10000;
  private dashboardChartFilter: any = null;

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
      // this.towerStatusId = paramMap.get('id');
    });
  }

  ngOnInit(): void {
    this.listen();
    this.init();
  }

  ngOnDestroy() {
    this.forImgPreview.unsubscribe();
  }

  listen() {
    this.forImgPreview = this.broadcast.on<string>('OPEN_GRAPHIC_FOR_SITE').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.showImg(data);
      });
    });
  }

  init() {
    this.dashboardChartFilter = this.util.getDashboardChartFilter();
    if (this.dashboardChartFilter) {
      const groupBy = this.dashboardChartFilter.groupBy;
      const groupValue = this.dashboardChartFilter.groupValue;
      this.filterParam[groupBy] = [groupValue];
      this.util.setDashboardChartFilter(null);
      this.loadFilterTowerStatusData();
    } else {
      this.loadTowerLatestData();
    }
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
      "date": null
    };
  }

  loadTowerLatestData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    const url = ApiConstant.getLatestData;
    this.httpClient.get(url).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.data) {
        this.manipulate(res.data);
        setTimeout(() => {
          this.tableListingComponent.init();
        });
      }
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Tower Latest Details!'
      })
    });
  }

  loadFilterTowerStatusData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let url = ApiConstant.getLatestData1;
    this.httpClient.post(url, this.filterParam).subscribe((data: any) => {
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
      for (let key in rowData) {
        if (TOWER_STATUS_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(TOWER_STATUS_COLUMN_HEADER[key]);
        }
      }
      this.sampleData.columnHeader.push(TOWER_STATUS_COLUMN_HEADER['alarmCategory']);
      this.sampleData.columnHeader.push(TOWER_STATUS_COLUMN_HEADER['hourlyReport']);
      this.sampleData.columnHeader.push(TOWER_STATUS_COLUMN_HEADER['imgPath']);
    }
  }

  setRowData(resData: any) {
    const data = resData || [];
    if (data.length) {
      for (let item of data) {
        item.age = parseInt(item.age, 10);
        if (item.age > this.ageLimit) {
          item.isDataOnline = false;
        } else {
          item.isDataOnline = true;
        }
        item.alarmCategory = 'Alarm Category';
        item.hourlyReport = 'Hourly Report';
        item.imgPath = 'View Image';
      }
      this.sampleData.data = data;
      this.allData.data = data;
    } else {
      this.sampleData.data = [];
      this.allData.data = data;
    }
  }

  goBack(evt?: any) {
    (window as any).history.back();
  }

  openFilter(evt?: any) {
    this.isReqToOpenFilter = !this.isReqToOpenFilter;
  }

  onFilterChange(evt?: any) {

  }

  openTabular(evt?: any) {
    this.isExpanded = !this.isExpanded;
  }

  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }

  setFilterParam(fData) {

    let regions: any = ["All"];
    let zones: any = ["All"];
    let clusters: any = ["All"];
    let siteId: any = ["All"];
    let deviceType: any = ["All"];
    let siteType: any = ["All"];
    let siteStatus: any = null;
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
        clusters = fData[2].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[3].popupTo.data && fData[3].popupTo.data.length) {
        siteId = fData[3].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[4].popupTo.data && fData[4].popupTo.data.length) {
        deviceType = fData[4].popupTo.data.map((item) => {
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

      siteStatus = fData[8];

      if (fData[9] && fData[9].startDate && fData[9].endDate) {
        rangeDate = fData[9].startDate.replace(/-/g, '/') + ' - ' + fData[9].endDate.replace(/-/g, '/');
      }
      // siteStatus = parseInt(fData[7], 10);


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
      "date": rangeDate
    };
  }

  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
    this.isOpenTabularFilter = false;
    if (evt) {
      this.setFilterParam(evt);
      this.loadFilterTowerStatusData();
    } else {
      this.setDefaultFilter();
      this.loadFilterTowerStatusData();
    }
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

  exportTableToExcel(type: string): void {
    /* pass here the table id */
    let element = document.getElementById('export-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `tower-status-data.${type}`);

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
    let selVal = this.ddExport;
    if (selVal === "1") {
      this.exportExcel(evt);
    } else if (selVal === "2") {
      this.exportCSV(evt);
    }
  }

  showImg(data) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ImgPreviewComponent, {
      width: '1000px',
      height: 'auto',
      data: data
    });
    dialogRef.afterClosed().subscribe(data => {

    });
  }

  searchGlobally(event) {
    let { value } = event.target;
    value = value.toUpperCase();
    if (value) {
      this.sampleData.data = this.allData.data.filter((item) => {
        if (!!item.smSiteCode && !!item.siteName) {
          return (item.siteName.includes(value) || item.smSiteCode.includes(value))
        }
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }

}
