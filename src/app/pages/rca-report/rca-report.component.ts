import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';

import { RCA_REPORT_COLUMN_HEADER } from './rca-report-column.enum';

import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';


import { alarmCategory } from '../data/alarm-category';
import { alarmStatus } from '../data/alarm-status';
import { clusterMaster } from '../data/cluster-master';
import { customerMaster } from '../data/customer-master';
import { deviceTypeMaster } from '../data/device-type-master';
import { hourlyReport } from '../data/hourly-report';
import { latestData } from '../data/latest-data';
import { latestReportStatus } from '../data/latest-report-status';
import { regionMaster } from '../data/region-master';
import { siteCodeMaster } from '../data/site-code-master';
import { siteTypeMaster } from '../data/site-type-master';
import { zoneMaster } from '../data/zone-master';
import { rcaReport } from '../data/rca-report';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';

@Component({
  selector: 'app-rca-report',
  templateUrl: './rca-report.component.html',
  styleUrls: ['./rca-report.component.scss']
})
export class RcaReportComponent implements OnInit {

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
  defaultFilterList: any = [];

  public isFilterDataLoaded: boolean = false;

  private sampleData: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  private allData: any = [];

  private filterParam: any = {};

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient
  ) { }

  listen() {

  }

  ngOnInit(): void {
    this.listen();
    this.init();
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
    this.httpClient.post(ApiConstant.getRCADataAll, {}).subscribe((data: any) => {
      this.isLoading = false;
      // console.log(data)
      if (!!data) {
        // data.data.forEach((item,index)=>{
        //   // console.log(item)
        //     // if(!!item.columns){
        //          item[0].columns.forEach((colunm,ind)=>{
        //         if(colunm.colDisplayName=='Site Id' || colunm.colDisplayName=='Site Name'){
        //            colunm.colType='textwithlink';
        //            item[0].columns[ind]=colunm.colType
        //         }
        //     })
        //   data.data[index]=item;
        //     // }

        // })
        this.allData = data;
        this.manipulate(data.data);
      }
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading RCA Report details!'
      })
    });
  }

  manipulate(data) {
    console.log("data....", data)
    this.setResponse(data);
    this.setColumnHeader(data);
    this.setRowData(data);
    this.activeListing.list = this.sampleData;
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo + 1;
    this.sampleData.listingType = AppConstant.RCA_REPORT_LISTING_TYPE;
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
        if (RCA_REPORT_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(RCA_REPORT_COLUMN_HEADER[key]);
        }
      }
      console.log(this.sampleData.columnHeader)
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

  searchGlobally(event) {
    let { value } = event.target;
    value = value.toUpperCase();
    if (value) {
      this.sampleData.data = this.allData.data.filter((item) => {
        if (!!item.smSitename && !!item.smSiteID) {
          return (item.smSiteID.includes(value) || item.smSitename.includes(value))
        }
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
    // this.broadcast.broadcast("searchResult", this.activeListing);
    // console.log(
    //   this.activeListing
    // )
  }

}
