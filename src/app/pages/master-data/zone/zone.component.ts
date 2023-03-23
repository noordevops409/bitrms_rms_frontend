import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';

import { ZONE_COLUMN_HEADER } from './zone-column.enum';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';

import { AddZoneComponent } from './add-zone/add-zone.component';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {

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
  public defaultFilterList: any = [];

  public isFilterDataLoaded: boolean = false;

  private countryList: any = [];
  private regionList: any = [];
  private sampleData: any = {};
  private currentPageNo: number = 1;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  private forEditListener!: Subscription;
  private forDeleteListener!: Subscription;

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
    this.init();
    this.listen();
  }

  ngOnDestroy(): void {
    this.forEditListener.unsubscribe();
    this.forDeleteListener.unsubscribe();
  }

  init() {
    this.loadCountry();
    this.loadRegion();
    setTimeout(() => {
      this.loadData();
    }, 1000);
  }

  listen() {
    this.forEditListener = this.broadcast.on<string>('OPEN_ZONE_FOR_EDIT').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.edit(null, data);
      });
    });

    this.forDeleteListener = this.broadcast.on<string>('OPEN_ZONE_FOR_DELETE').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.delete(data);
      });
    });
  }

  loadCountry() {
    const url = ApiConstant.getCountryMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.countryMasterList && data.countryMasterList.length) {
        this.countryList = data.countryMasterList;
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading country list!'
      });
    });
  }

  loadRegion() {
    const url = ApiConstant.getRegionMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.regionMasterList && data.regionMasterList.length) {
        this.regionList = data.regionMasterList;
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading region list!'
      });
    });
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.getZoneMasterData;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.post(apiUrl, null).subscribe((res: any) => {
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

  manipulate(res) {
    this.setResponse(res.zoneMasterList);
    this.setColumnHeader(res.zoneMasterList);
    this.setRowData(res.zoneMasterList);
    this.activeListing.list = this.sampleData;
    this.sampleData.totalDocs = res.totalCount || res.zoneMasterList.length;
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo;
    this.sampleData.listingType = AppConstant.ZONE_MASTER_LISTING_TYPE;
    this.sampleData.recordBatchSize = this.pageSize || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.retainNoOfShow = this.pageSize;
    this.sampleData.sortField = 'znZoneID';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      // this.sampleData.columnHeader.push(LATEST_DATA1_COLUMN_HEADER['checkbox']);
      this.sampleData.columnHeader.push(ZONE_COLUMN_HEADER['delete']);
      this.sampleData.columnHeader.push(ZONE_COLUMN_HEADER['srno']);
      for (let key in rowData) {
        if (key === "cmID") {
          this.sampleData.columnHeader.push(ZONE_COLUMN_HEADER['country']);
        } else if (key === 'rgRegionID') {
          this.sampleData.columnHeader.push(ZONE_COLUMN_HEADER['region']);
        } else if (ZONE_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(ZONE_COLUMN_HEADER[key]);
        }
      }
    }
  }

  setCountry(req?: any) {
    for (let item of this.countryList) {
      if (item.countryID === req.cmID) {
        req.country = item.country;
        break;
      }
    }
  }

  setRegion(req?: any) {
    for (let item of this.regionList) {
      if (item.rgRegionID === req.rgRegionID) {
        req.region = item.rgRegion;
        break;
      }
    }
  }

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        this.setCountry(item);
        this.setRegion(item);
        counter += 1;
        item.srno = counter;
        item.delete = "Delete";
      }
      this.sampleData.data = data;
    } else {
      this.sampleData.data = [];
    }
  }


  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
    // this.setFilterParam(evt);
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


  exportTableToExcel(type: string): void {
    /* pass here the table id */
    let element = document.getElementById('export-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `zone-data.${type}`);

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

  add(evt?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddZoneComponent, {
      width: '1000px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.zoneMasterList && data.zoneMasterList.length) {
          this.manipulate(data);
        } else {
          this.loadData();
        }
      }
    });
  }

  edit(evt?: any, item?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddZoneComponent, {
      width: '1000px',
      height: 'auto',
      data: item
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.zoneMasterList && data.zoneMasterList.length) {
          this.manipulate(data);
        } else {
          this.loadData();
        }
      }
    });
  }

  delete(item?: any, i?: any) {
    var r = confirm("Are you sure you want to delete selected record");
    if (r) {
      this.httpClient.post(ApiConstant.deleteZoneMasterData + `?znZoneID=${item.znZoneID}`, null).subscribe((data) => {
        this.util.notification.success({
          title: 'Success',
          msg: 'Zone details deleted successfully.'
        });
        this.loadData();
      }, (err) => {
        this.util.notification.error({
          title: 'Error',
          msg: 'Error while deleting zone details!'
        })
      });
    }
  }

}
