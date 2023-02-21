import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';

import { TEE_POWER_TRACKER_COLUMN_HEADER } from './tee-power-tracker-column.enum';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';

import { customerMaster } from '../../data/customer-master';
import { siteTypeMaster } from '../../data/site-type-master';
import { powerSourceMaster } from '../../data/power-source-master';

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
      id: 'FMF04',
      fieldName: 'customerId',
      indexField: 'customerId',
      labelName: 'Customer',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'customerId',
      data: customerMaster,
      isDataLoaded: true,
      isDynamic: false,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'POST',
      xhrUrl: ApiConstant.getCustomerMaster,
      xhrParam: [
        {
          "name": "string"
        }
      ],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'name',
        value: 'name'
      }
    },
    {
      id: 'FMF05',
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
      id: 'FMF06',
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
  private currentPageNo: number = 1;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;

  private filterParam: any = {
    "siteId": [

    ],
    "customers": [

    ],
    "zones": [

    ],
    "regions": [

    ],
    "deviceType": [

    ],
    "startDate": "2020-10-11",
    "endDate": "2020-12-12"
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
    this.loadData();
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.getTeePowerTrackerReport + `/${this.currentPageNo}/size/${this.pageSize}`;
    this.httpClient.post(apiUrl, this.filterParam).subscribe((data: any) => {
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

  setFilterParam(fData) {

    let siteId: any = [];
    let customers: any = [];
    let zones: any = [];
    let regions: any = [];
    let deviceType: any = [];
    let startDate: any = "";
    let endDate: any = "";
    if (fData && fData.length) {
      siteId = fData[0].popupTo.data.map((item) => {
        return item.id;
      });

      customers = fData[1].popupTo.data.map((item) => {
        return item.id;
      });

      zones = fData[2].popupTo.data.map((item) => {
        return item.id;
      });

      regions = fData[3].popupTo.data.map((item) => {
        return item.id;
      });

      deviceType = fData[4].popupTo.data.map((item) => {
        return item.id;
      });

      if (fData[6] && fData[6].startDate && fData[6].endDate) {
        startDate = fData[6].startDate;
        endDate = fData[6].endDate;
      }
    };
    
    this.filterParam = {
      "siteId": siteId,
      "customers": customers,
      "zones": zones,
      "regions": regions,
      "deviceType": deviceType,
      "startDate": startDate,
      "endDate": endDate
    };
  }

  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
    this.setFilterParam(evt);
    this.loadData();
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
