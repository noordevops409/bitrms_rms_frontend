import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';

import { RAW_DATA_REPORT_COLUMN_HEADER } from './raw-data-report-column.enum';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';

@Component({
  selector: 'app-raw-data-report',
  templateUrl: './raw-data-report.component.html',
  styleUrls: ['./raw-data-report.component.scss']
})
export class RawDataReportComponent implements OnInit, OnDestroy {

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
      data: [],
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
      data: [],
      isDataLoaded: false,
      isDynamic: true,
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
      data: [],
      isDataLoaded: false,
      isDynamic: true,
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
      xhrMethod: 'POST',
      xhrUrl: ApiConstant.getDeviceTypeMaster,
      xhrParam: [
        {
          "deviceType": "string"
        }
      ],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'deviceType',
        value: 'deviceType'
      }
    }
  ];

  public isFilterDataLoaded: boolean = false;

  private sampleData: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;

  private filterParam: any = {};

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
    this.loadData();
  }

  setFilterParam() {

  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.httpClient.post(ApiConstant.getRawDataReport, {}).subscribe((data: any) => {
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
        msg: 'Error while loading Raw Data Report details!'
      })
    });
  }

  manipulate(data) {
    this.setResponse(data);
    this.setColumnHeader(data);
    this.setRowData(data);
    this.activeListing.list = this.sampleData;
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo + 1;
    this.sampleData.listingType = AppConstant.RAW_DATA_REPORT_LISTING_TYPE;
    this.sampleData.recordBatchSize = 50 || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.sortField = 'rcaid';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
    this.sampleData.totalDocs = resData.totalElements || resData.length;
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      // this.sampleData.columnHeader.push(LATEST_DATA1_COLUMN_HEADER['checkbox']);
      for (let key in rowData) {
        if (RAW_DATA_REPORT_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(RAW_DATA_REPORT_COLUMN_HEADER[key]);
        }
      }
    }
  }

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
      this.sampleData.data = data;
    } else {
      this.sampleData.data = [];
    }
  }

  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }

  exportCSV(evt?: any) {

  }

  exportExcel(evt?: any) {

  }

  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
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

}
