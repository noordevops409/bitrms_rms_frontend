import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';

import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';

import { engineerNameList } from '../data/engineerName';
import { customerMaster } from '../data/customer-master';
import { REMOTE_COMMANDS_COLUMN_HEADER } from './remote-commands.enum';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';

import { SaveRemoteComponent } from './save-remote/save-remote.component';

@Component({
  selector: 'app-remote-commands',
  templateUrl: './remote-commands.component.html',
  styleUrls: ['./remote-commands.component.scss']
})
export class RemoteCommandsComponent implements OnInit {

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
  public defaultFilterList: any = [
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

  private sampleData: any = {};
  private allData: any = {};
  private currentPageNo: number = 1;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;

  private forEditListener!: Subscription;
  private forDeleteListener!: Subscription;
  private filterParam: any = {
    "siteId": ['All'],
    "clusters": ['All'],
    "zones": ['All'],
    "regions": ['All'],
    "deviceType": ['All'],
    "siteType": ['All'],
    "siteStatus": ['All'],
    "customers": ['All'],
    "engineer": ['All']
  };

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
      "engineer": ['All']
    };
  }

  listen() {
    this.forEditListener = this.broadcast.on<string>('OPEN_COUNTRY_FOR_EDIT').subscribe((data: any) => {
      this.ngZone.run(() => {
        // this.edit(null, data);
      });
    });

    this.forDeleteListener = this.broadcast.on<string>('OPEN_SIM_FOR_DELETE').subscribe((data: any) => {
      this.ngZone.run(() => {
        // this.delete(data);
      });
    });
  }

  init() {
    this.loadData();
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.viewRemoteSite;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.post(apiUrl, this.filterParam).subscribe((res: any) => {
      this.isLoading = false;
      this.manipulate(res);
      if (res && res.data && Array.isArray(res.data)) {
        res.data.forEach((item) => {
          const date = new Date(item.rmcTimestamp * 1000); 
          const formattedDate = this.formatDate(date);
          item.rmcTimestamp=formattedDate;
          if (item.dgbatteryvoltage !== undefined) {
            item.dgbatteryvoltage = item.dgbatteryvoltage * 10;
          }
        });
      } else {
        console.error("Invalid response structure. Unable to iterate over data.");
      }
      res.data.sort((a, b) => {
        const timestampA = a.rmcTimestamp.toLowerCase();
        const timestampB = b.rmcTimestamp.toLowerCase();
        if (timestampA < timestampB) return 1; 
        if (timestampA > timestampB) return -1; 
        return 0; 
      });
      //console.log("Data after sorting:", res.data); 
      this.setRowData(res.data);
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Remote command sites details!'
      })
    });
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  manipulate(res) {
    this.setResponse(res.data);
    this.setColumnHeader(res.data);
    //this.setRowData(res.data);
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
      this.sampleData.columnHeader.push(REMOTE_COMMANDS_COLUMN_HEADER['srno']);
      for (let key in rowData) {
        if (REMOTE_COMMANDS_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(REMOTE_COMMANDS_COLUMN_HEADER[key]);
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

      // if (fData[9] && fData[9].startDate && fData[9].endDate) {
      //   rangeDate = fData[9].startDate.replace(/-/g, '/') + ' - ' + fData[9].endDate.replace(/-/g, '/');
      // }
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
      "engineer": engineer.length === 0 ? ['All'] : engineer
    };
  }

  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
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
    XLSX.writeFile(wb, `remote-commands.${type}`);

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
        // item.country = item.country.toString();
        if (!!item.smSitecode) {
          return item.smSitecode.toLowerCase().includes(value);
        }
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }

  add(evt?: any) {
    this.dialog.closeAll();
    window.localStorage.removeItem('selCountry');
    const dialogRef = this.dialog.open(SaveRemoteComponent, {
      width: '1000px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.countryMasterList && data.countryMasterList.length) {
          this.manipulate(data);
        } else {
          this.loadData();
        }
      }
    });
  }

  edit(evt?: any, item?: any) {
    this.dialog.closeAll();
    window.localStorage.removeItem('selCountry');
    window.localStorage.setItem('selCountry', JSON.stringify(item));
    const dialogRef = this.dialog.open(SaveRemoteComponent, {
      width: '1000px',
      height: 'auto',
      data: item
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.countryMasterList && data.countryMasterList.length) {
          this.manipulate(data);
        } else {
          this.loadData();
        }
      }
    });
  }
}
