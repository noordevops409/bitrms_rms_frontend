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

import { VIEW_REMOTE_DATA_COLUMN_HEADER } from './view-remote-data.enum';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';

import { SaveRemoteComponent } from '../save-remote/save-remote.component';
import * as moment from 'moment';

@Component({
  selector: 'app-view-remote-data',
  templateUrl: './view-remote-data.component.html',
  styleUrls: ['./view-remote-data.component.scss']
})
export class ViewRemoteDataComponent implements OnInit, OnDestroy {

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

  private sampleData: any = {};
  private allData: any = {};
  private currentPageNo: number = 1;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;

  private forEditListener!: Subscription;
  private forDeleteListener!: Subscription;
  private siteId: any = null;
  private filterParam: any = {
    "allSiteId": true,
    "siteId": []
  };

  private dummyData: any = [
    [
      1,
      "w_77",
      null,
      10,
      null,
      "2020-12-09",
      "forcedgstart",
      "Force DG Start Command Enable"
    ],
    [
      2,
      "w_78",
      null,
      10,
      null,
      "2020-12-09",
      "forcedgruntime",
      "Force DG Run Time Setting"
    ],
    [
      3,
      "w_79",
      null,
      10,
      null,
      "2020-12-09",
      "dgbatteryvoltage",
      "DG Start Battery Voltage"
    ],
    [
      4,
      "w_80",
      null,
      10,
      null,
      "2020-12-09",
      "bulkvoltage",
      "BULK VOLTAGE"
    ],
    [
      5,
      "w_81",
      null,
      10,
      null,
      "2020-12-09",
      "floatvoltage",
      "FLOAT VOLTAGE"
    ],
    [
      6,
      "w_82",
      null,
      10,
      null,
      "2020-12-09",
      "accharger_startvoltage",
      "AC Charger Start Voltage"
    ],
    [
      7,
      "w_83",
      null,
      10,
      null,
      "2020-12-09",
      "accharger_stopvoltage",
      "AC CHarger Stop Voltage"
    ],
    [
      8,
      "w_84",
      null,
      10,
      null,
      "2020-12-09",
      "charger_batt_currentlimit",
      "CHARGER BATTERY CURRENT LIMIT (A)"
    ],
    [
      9,
      "w_85",
      null,
      10,
      null,
      "2020-12-09",
      "min_load_threshold_watt",
      "Minimum Load THREsold Value"
    ],
    [
      10,
      "w_86",
      null,
      10,
      null,
      "2020-12-09",
      "max_export_power_watt",
      "MAX EXPORT POWER"
    ],
    [
      11,
      "w_87",
      null,
      10,
      null,
      "2020-12-09",
      "batt_capacity_kwh",
      "BATTERY CAPACITY (WATT HOUR)"
    ]
  ];

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
      this.siteId = paramMap.get('id');
    });
  }

  ngOnInit(): void {
    this.init();
    this.listen();
  }

  ngOnDestroy(): void {
    this.forEditListener.unsubscribe();
    this.forDeleteListener.unsubscribe();
  }

  listen() {
    this.forEditListener = this.broadcast.on<string>('OPEN_REMOTE_DATA_FOR_EDIT').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.edit(null, data);
      });
    });

    this.forDeleteListener = this.broadcast.on<string>('OPEN_SIM_FOR_DELETE').subscribe((data: any) => {
      this.ngZone.run(() => {
        // this.delete(data);
      });
    });
  }

  init() {
    if (this.siteId) {
      this.filterParam.siteId = [this.siteId];
      this.loadData();
    }
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.viewRemoteSiteFilter;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.post(apiUrl, this.filterParam).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.data && res.data.length) {
        let rowData = res.data[0];
        let list: any = [];
        this.allData.data = rowData;
        for (let item of this.dummyData) {
          let column = item[6];
          if (rowData[column]) {
            rowData[column + '_ts'] = parseInt(rowData[column + '_ts'], 10);
            let obj: any = {
              code: item[1],
              command: item[7],
              configureValue: rowData[column],
              timestamp: rowData[column + '_ts'],
              triggerTime: moment(rowData[column + '_ts']).format("YYYY-MM-DD HH:mm:ss"),
              status: 'ACK',
              ouddeviceid: rowData.dvuniqueid,
              ouddevicetype: "",
              oudcommandtype: "",
              oudmode: "g",
              oudstatus: "10",
              updateval: "string",
              smsiteid: rowData.smSiteID,
              smsitecode: rowData.smSitecode,
              rmcid: rowData.rmcid
            };
            list.push(obj);
          }
        }
        res.data = list;
      }
      this.manipulate(res);
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading view remote site details!'
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
    this.sampleData.listingType = AppConstant.REMOTE_COMMANDS_LISTING_TYPE;
    this.sampleData.recordBatchSize = this.pageSize || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.retainNoOfShow = this.pageSize;
    this.sampleData.sortField = 'rmcid';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      this.sampleData.columnHeader.push(VIEW_REMOTE_DATA_COLUMN_HEADER['srno']);
      for (let key in rowData) {
        if (VIEW_REMOTE_DATA_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(VIEW_REMOTE_DATA_COLUMN_HEADER[key]);
        }
      }
      this.sampleData.columnHeader.push(VIEW_REMOTE_DATA_COLUMN_HEADER['edit']);
    }
  }

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        counter += 1;
        item.srno = counter;
        item.edit = 'Edit';
      }
      this.sampleData.data = data;
      this.allData.data = data;
    } else {
      this.sampleData.data = [];
      this.allData.data = [];
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
    XLSX.writeFile(wb, `view-remote-data.${type}`);

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
        item.command = item.command.toString();
        return (item.command.toLowerCase().includes(value));
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }

  edit(evt?: any, item?: any) {
    this.dialog.closeAll();
    window.localStorage.removeItem('selRemoteData');
    window.localStorage.setItem('selRemoteData', JSON.stringify(item));
    const dialogRef = this.dialog.open(SaveRemoteComponent, {
      width: '1000px',
      height: 'auto',
      data: item
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.loadData();
      }
    });
  }

}
