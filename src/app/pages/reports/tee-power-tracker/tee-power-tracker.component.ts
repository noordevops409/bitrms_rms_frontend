import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';

import { TEE_POWER_TRACKER_COLUMN_HEADER } from './tee-power-tracker-column.enum';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';

import { customerMaster } from '../../data/customer-master';
import { siteTypeMaster } from '../../data/site-type-master';
import { powerSourceMaster } from '../../data/power-source-master';
import * as moment from 'moment';

@Component({
  selector: 'app-tee-power-tracker',
  templateUrl: './tee-power-tracker.component.html',
  styleUrls: ['./tee-power-tracker.component.scss']
})
export class TeePowerTrackerComponent implements OnInit {

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
    }
  ];

  public isFilterDataLoaded: boolean = false;
  public allData: any = {};
  public ddExport: any = "-1";
  public exportData: any = {
    data: []
  };
  public isExporting: boolean = false;

  private sampleData: any = {};
  private currentPageNo: number = 1;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;

  private filterParam: any = {
    "regions": [],
    "zones": [],
    "clusters": [],
    "siteId": [],
    "deviceType": [],
    "siteType": [],
    "siteStatus": 1,
    "startDate": moment().add(-1, 'days').format("YYYY-MM-DD"),
    "endDate": moment().add(-1, 'days').format("YYYY-MM-DD")
  };


  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient
  ) {

  }


  listen() {

  }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy() {

  }

  init() {
    // this.loadData();
  }


  fetchData(evt?: any) {
    this.loadData();
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.getTeePowerTrackerReport + `/${this.currentPageNo}/size/${this.pageSize}`;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.post(apiUrl, this.filterParam).subscribe((res: any) => {
      this.isLoading = false;
      this.manipulate(res);
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Raw Data Report details!'
      })
    });
  }

  loadAllData() {
    return new Promise((resolve, reject) => {
      let list: any = [];
      let pageSize = 100;
      let getAll = () => {
        let apiUrl: any = ApiConstant.getTeePowerTrackerReport + `/${this.currentPageNo}/size/${pageSize}`;
        this.httpClient.post(apiUrl, this.filterParam).subscribe((res: any) => {
          list.push(...res.data);
          this.currentPageNo += 1;
          pageSize = Math.min(100, (res.totalCount - list.length));
          if (res.totalCount === list.length) {
            res.data = list;
            this.currentPageNo = 1;
            pageSize = 10;
            resolve(res);
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

  manipulate(res) {
    this.setResponse(res.data);
    this.setColumnHeader(res.data);
    this.setRowData(res.data);
    this.activeListing.list = this.sampleData;
    this.sampleData.totalDocs = res.totalCount || res.data.length;
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo;
    this.sampleData.listingType = AppConstant.TEE_POWER_TRACKER_LISTING_TYPE;
    this.sampleData.recordBatchSize = this.pageSize || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.retainNoOfShow = this.pageSize;
    this.sampleData.sortField = 'smSiteId';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      // this.sampleData.columnHeader.push(LATEST_DATA1_COLUMN_HEADER['checkbox']);
      for (let key in rowData) {
        if (TEE_POWER_TRACKER_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(TEE_POWER_TRACKER_COLUMN_HEADER[key]);
        }
      }
    }
  }


  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
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

    let regions: any = ['All'];
    let zones: any = ['All'];
    let clusters: any = ['All'];
    let siteId: any = ['All'];
    let deviceType: any = ['All'];
    let siteType: any = ['All'];
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

      if (fData[5] && fData[5].length) {
        siteType = fData[5].filter((item) => {
          return item.isChecked && item.text;
        }).map((item) => {
          return item.text;
        });
      }

      if (fData[6] && fData[6].startDate && fData[6].endDate) {
        rangeDate = fData[6].startDate.replace(/-/g, '/') + ' - ' + fData[6].endDate.replace(/-/g, '/');
      }
    }
    this.filterParam = {
      "siteId": siteId,
      "clusters": clusters,
      "zones": zones,
      "regions": regions,
      "deviceType": deviceType,
      "siteStatus": 1,
      "siteType": siteType.length ? siteType : ['All'],
      "date": rangeDate,
      "start": 1,
      "length": 10,
      "draw": 5,
      "page": 15
    };
  }

  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
    this.setFilterParam(evt);
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

  searchGlobally(event) {
    let { value } = event.target;
    value = value.toUpperCase();
    if (value) {
      this.sampleData.data = this.allData.data.filter((item) => {
        if (!!item.region && !!item.smSiteCode && !!item.engineerName) {
          return (item.region.includes(value) || item.smSiteCode.includes(value) || item.engineerName.includes(value))
        }
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }

  exportTableToExcel(type: string): void {
    /* pass here the table id */
    let element = document.getElementById('export-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `tee-power-tracker.${type}`);
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
    this.isExporting = true;
    if (this.exportData.data.length === 0) {
      this.loadAllData().then((res: any) => {
        this.exportData.data = res.data;
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
    } else {
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

}
