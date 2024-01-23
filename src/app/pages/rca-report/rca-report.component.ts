import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';

import { RCA_REPORT_COLUMN_HEADER } from './rca-report-column.enum';
import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';
import { engineerNameList } from '../data/engineerName';
import { customerMaster } from '../data/customer-master';

import { AddEditRcaReportComponent } from './add-edit-rca-report/add-edit-rca-report.component';
import { TableListingComponent } from '../../shared/table-listing/table-listing.component';
import * as moment from 'moment';

@Component({
  selector: 'app-rca-report',
  templateUrl: './rca-report.component.html',
  styleUrls: ['./rca-report.component.scss']
})
export class RcaReportComponent implements OnInit, OnDestroy {

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
  defaultFilterList: any = [
    // {
    //   id: 'FMF01',
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
    // {
    //   id: 'FMF02',
    //   fieldName: 'zones',
    //   indexField: 'zones',
    //   labelName: 'Zone',
    //   dataType: 'Dropdown',
    //   popupTo: {
    //     recordBatchSize: 25,
    //     data: []
    //   },
    //   listingColumnFieldName: 'zones',
    //   data: [],
    //   isDataLoaded: false,
    //   isDynamic: true,
    //   isOpen: false,
    //   isReqRemove: false,
    //   xhrMethod: 'GET',
    //   xhrUrl: ApiConstant.getZoneMaster,
    //   xhrParam: [],
    //   isReqManipulate: true,
    //   isAllDataLoaded: true,
    //   maniObj: {
    //     id: 'znZone',
    //     value: 'znZone'
    //   }
    // },
    // {
    //   id: 'FMF03',
    //   fieldName: 'clusters',
    //   indexField: 'clusters',
    //   labelName: 'Cluster',
    //   dataType: 'Dropdown',
    //   popupTo: {
    //     recordBatchSize: 25,
    //     data: []
    //   },
    //   listingColumnFieldName: 'clusters',
    //   data: [],
    //   isDataLoaded: false,
    //   isDynamic: true,
    //   isOpen: false,
    //   isReqRemove: false,
    //   xhrMethod: 'GET',
    //   xhrUrl: ApiConstant.getClusterMaster,
    //   xhrParam: [],
    //   isReqManipulate: true,
    //   isAllDataLoaded: true,
    //   maniObj: {
    //     id: 'crName',
    //     value: 'crName'
    //   }
    // },
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
    // {
    //   id: 'FMF05',
    //   fieldName: 'deviceType',
    //   indexField: 'deviceType',
    //   labelName: 'Device Type',
    //   dataType: 'Dropdown',
    //   popupTo: {
    //     recordBatchSize: 25,
    //     data: []
    //   },
    //   listingColumnFieldName: 'deviceType',
    //   data: [],
    //   isDataLoaded: false,
    //   isDynamic: true,
    //   isOpen: false,
    //   isReqRemove: false,
    //   xhrMethod: 'GET',
    //   xhrUrl: ApiConstant.getDeviceTypeMaster,
    //   xhrParam: [],
    //   isReqManipulate: true,
    //   isAllDataLoaded: true,
    //   maniObj: {
    //     id: 'deviceType',
    //     value: 'deviceType'
    //   }
    // },
    // {
    //   id: 'FMF06',
    //   fieldName: 'customers',
    //   indexField: 'customers',
    //   labelName: 'Customer',
    //   dataType: 'Dropdown',
    //   popupTo: {
    //     recordBatchSize: 25,
    //     data: []
    //   },
    //   listingColumnFieldName: 'customers',
    //   data: customerMaster,
    //   isDataLoaded: true,
    //   isDynamic: false,
    //   isOpen: false,
    //   isReqRemove: false,
    //   xhrMethod: 'GET',
    //   xhrUrl: null,
    //   xhrParam: [],
    //   isReqManipulate: true,
    //   isAllDataLoaded: true,
    //   maniObj: {
    //     id: 'id',
    //     value: 'value'
    //   }
    // },
    // {
    //   id: 'FMF07',
    //   fieldName: 'engineerName',
    //   indexField: 'engineerName',
    //   labelName: 'Engineer',
    //   dataType: 'Dropdown',
    //   popupTo: {
    //     recordBatchSize: 25,
    //     data: []
    //   },
    //   listingColumnFieldName: 'engineerName',
    //   data: engineerNameList,
    //   isDataLoaded: true,
    //   isDynamic: false,
    //   isOpen: false,
    //   isReqRemove: false,
    //   xhrMethod: 'GET',
    //   xhrUrl: null,
    //   xhrParam: [],
    //   isReqManipulate: true,
    //   isAllDataLoaded: true,
    //   maniObj: {
    //     id: 'id',
    //     value: 'value'
    //   }
    // }
  ];

  public isFilterDataLoaded: boolean = false;

  private sampleData: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  private allData: any = {};
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
    "engineer": ['All'],
    "date": null,
    // "startDate": moment().add(-2, 'days').format("YYYY-MM-DD"),
    // "endDate": moment().add(-1, 'days').format("YYYY-MM-DD")
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
    this.listen();
    this.init();
  }

  ngOnDestroy(): void {
    this.forEditListener.unsubscribe();
    this.forDeleteListener.unsubscribe();
  }

  init() {
    this.loadData();
  }

  listen() {
    this.forEditListener = this.broadcast.on<string>('OPEN_RCA_REPORT_FOR_EDIT').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.edit(null, data);
      });
    });

    this.forDeleteListener = this.broadcast.on<string>('OPEN_RCA_REPORT_FOR_DELETE').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.delete(data);
      });
    });
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
      // "startDate": moment().add(-2, 'days').format("YYYY-MM-DD"),
      // "endDate": moment().add(-1, 'days').format("YYYY-MM-DD")
    };
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.httpClient.post(ApiConstant.getRCADataAll, this.filterParam).subscribe((data: any) => {
      this.isLoading = false;
      this.manipulate(data);
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
    this.setResponse(data.data);
    this.setColumnHeader(data.data);
    this.setRowData(data.data);
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
      this.sampleData.columnHeader.push(RCA_REPORT_COLUMN_HEADER['srno']);
      for (let key in rowData) {
        if (RCA_REPORT_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(RCA_REPORT_COLUMN_HEADER[key]);
        }
      }
      this.sampleData.columnHeader.push(RCA_REPORT_COLUMN_HEADER['delete']);
    }
  }

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        counter += 1;
        item.srno = counter;
        item.delete = "Delete";
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
let startDate="";
let endDate="";
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
    //  console.log(fData);
      // if (fData[0].popupTo.data && fData[0].popupTo.data.length) {
      //   regions = fData[0].popupTo.data.map((item) => {
      //     return item.id;
      //   });
      // }

      // if (fData[1].popupTo.data && fData[1].popupTo.data.length) {
      //   zones = fData[1].popupTo.data.map((item) => {
      //     return item.id;
      //   });
      // }

      // if (fData[2].popupTo.data && fData[2].popupTo.data.length) {
      //   clusters = fData[2].popupTo.data.map((item) => {
      //     return item.id;
      //   });
      // }

      if (fData[0].popupTo.data && fData[0].popupTo.data.length) {
        siteId = fData[0].popupTo.data.map((item) => {
          return item.id;
        });
      }

      // if (fData[4].popupTo.data && fData[4].popupTo.data.length) {
      //   deviceType = fData[4].popupTo.data.map((item) => {
      //     return item.id;
      //   });
      // }

      // if (fData[5].popupTo.data && fData[5].popupTo.data.length) {
      //   customer = fData[5].popupTo.data.map((item) => {
      //     return item.id;
      //   });
      // }

      // if (fData[6].popupTo.data && fData[6].popupTo.data.length) {
      //   engineer = fData[6].popupTo.data.map((item) => {
      //     return item.id;
      //   });
      // }

      if (fData[1] && fData[1].length) {
        siteType = fData[1].filter((item) => {
          return item.isChecked && item.text;
        }).map((item) => {
          return item.text;
        });
      }

      //siteStatus = fData[8];

      if (fData[2] && fData[2].startDate !== null && fData[2].endDate !== null) {
        startDate = fData[2].startDate.replace(/-/g, '/');
        endDate = fData[2].endDate.replace(/-/g, '/');
        rangeDate = startDate + ' - ' + endDate;
      } else {
        // Handle the case where startDate or endDate is null
        startDate = "";
        endDate = "";
        rangeDate = "";
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
      "date": rangeDate,
      "startDate":startDate,
      "endDate":endDate
    };
  }

  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
    this.isOpenTabularFilter = false;
    if (evt) {
      this.setFilterParam(evt);
      this.loadData();
    } else {
      this.setDefaultFilter();
      this.loadData();
    }
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

  exportTableToExcel(type: string): void {
    /* pass here the table id */
    let element = document.getElementById('export-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `rca-report.${type}`);
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
  }

  add(evt?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddEditRcaReportComponent, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.data && data.data.length) {
          this.manipulate(data);
        } else {
          this.loadData();
        }
      }
    });
  }

  edit(evt?: any, item?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddEditRcaReportComponent, {
      width: '800px',
      data: item
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.data && data.data.length) {
          this.manipulate(data);
        } else {
          this.loadData();
        }
      }
    });
  }

  delete(item: any) {
    var r = confirm("Are you sure you want to delete selected record");
    if (r) {
      this.httpClient.post(ApiConstant.deleteRCAData + `?rcaidLong=${item.rcaid}`, null).subscribe((data) => {
        this.util.notification.success({
          title: 'Success',
          msg: 'RCA report details deleted successfully.'
        });
        this.loadData();
      }, (err) => {
        this.util.notification.error({
          title: 'Error',
          msg: 'Error while deleting rca report details!'
        })
      });
    }
  }

}
