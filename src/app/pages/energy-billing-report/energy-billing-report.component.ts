import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormControl } from '@angular/forms';
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
import { ENERGY_BILLING_COLUMN_HEADER } from './energy-billing-column.enum';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';
import * as moment from 'moment';

@Component({
  selector: 'app-energy-billing-report',
  templateUrl: './energy-billing-report.component.html',
  styleUrls: ['./energy-billing-report.component.scss']
})
export class EnergyBillingReportComponent implements OnInit, OnDestroy {

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

  public ddExport: any = "-1";
  public isFilterDataLoaded: boolean = false;
  public exportData: any = {
    data: []
  };
  public isExporting: boolean = false;

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

  private sampleData: any = {};
  private allData: any = {};
  private currentPageNo: number = 1;
  private pageSize: number = 100;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  public  isDataFetched: boolean = false;


  public startTime: any = "00:00";
  public endTime: any = "23:59";
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
    "startDate": moment(moment().add(-2, 'days').format('YYYY-MM-DD') + ' ' + this.startTime + ':00').format('YYYY-MM-DD HH:mm:ss'),
    "endDate": moment(moment().add(-1, 'days').format('YYYY-MM-DD') + ' ' + this.endTime + ':00').format('YYYY-MM-DD HH:mm:ss')
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
   
  }
  fetchData(evt?: any) {
    this.isDataFetched = true;

    this.loadData();
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
      "date": "2023/06/15 00:01:00 - 2023/06/16 23:54:00"  
     };
      let startDate = moment().add(-2, 'days').format('YYYY/MM/DD');
      let endDate = moment().add(-1, 'days').format('YYYY/MM/DD')
      this.filterParam.date = `${startDate} 00:00:00 - ${endDate} 23:59:00`;
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.getEnergyBillingReport + `/${this.currentPageNo}/size/${this.pageSize}`;
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
        msg: 'Error while loading energy billing report details!'
      })
    });
  }

  loadAllData() {
    return new Promise((resolve, reject) => {
      let list: any = [];
      let pageSize = 100;
      let getAll = () => {
        let apiUrl: any = ApiConstant.getEnergyBillingReport + `/${this.currentPageNo}/size/${pageSize}`;
        this.httpClient.post(apiUrl, this.filterParam).subscribe((res: any) => {
          if (res.data && res.data.length) {
            list.push(...res.data);
          } else {
            res.data = list;
            this.currentPageNo = 1;
            pageSize = 10;
            resolve(res);
            return;
          }
          this.currentPageNo += 1;
          pageSize = Math.min(100, (res.totalCount - list.length));
          if (res.totalCount === list.length) {
            res.data = list;
            this.currentPageNo = 1;
            pageSize = 10;
            resolve(res);
            return;
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
    this.sampleData.listingType = AppConstant.ENERGY_BILLING_REPORT_LISTING_TYPE;
    this.sampleData.recordBatchSize = this.pageSize || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.retainNoOfShow = this.pageSize;
    this.sampleData.sortField = 'smSiteCode';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      // this.sampleData.columnHeader.push(ENERGY_BILLING_COLUMN_HEADER['srno']);
      for (let key in rowData) {
        if (ENERGY_BILLING_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(ENERGY_BILLING_COLUMN_HEADER[key]);
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

    let regions: any = ["All"];
    let zones: any = ["All"];
    let siteId: any = ["All"];
    let deviceType: any = ["All"];
    let siteType: any = ["All"];
    // let startDate: any = null;
    // let endDate: any = null;
    let customer: any = ["All"];
    let rangeDate: any = "";
    let siteStatus: any = null;
    let clusters: any = ["All"];
    let engineer: any = ["All"];
    if (fData && fData.length) {

      if (fData[0].popupTo.data && fData[0].popupTo.data.length) {
        regions = fData[0].popupTo.data.map((item) => {
          return item.id;
        });
      }

      // if (fData[1].popupTo.data && fData[1].popupTo.data.length) {
      //   zones = fData[1].popupTo.data.map((item) => {
      //     return item.id;
      //   });
      // }

      if (fData[1].popupTo.data && fData[1].popupTo.data.length) {
        clusters = fData[1].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[2].popupTo.data && fData[2].popupTo.data.length) {
        siteId = fData[2].popupTo.data.map((item) => {
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

      if (fData[3] && fData[3].length) {
        siteType = fData[3].filter((item) => {
          return item.isChecked && item.text;
        }).map((item) => {
          return item.text;
        });
      }

      // siteStatus = fData[8];

      if (fData[4] && fData[4].startDate && fData[4].endDate) {
        rangeDate = fData[4].startDate.replace(/-/g, '/') + ' - ' + fData[4].endDate.replace(/-/g, '/');
      } else {
        let startDate = moment().add(-2, 'days').format('YYYY/MM/DD');
        let endDate = moment().add(-1, 'days').format('YYYY/MM/DD')
        rangeDate = `${startDate} 00:00:00 - ${endDate} 23:59:00`;
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
      "date": rangeDate
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
    XLSX.writeFile(wb, `energy-billing-report.${type}`);
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

  searchGlobally(event) {
    let { value } = event.target;
    value = value.toLowerCase();
    if (value) {
      this.sampleData.data = this.allData.data.filter((item) => {
        if (!!item.rgRegion || !!item.smSiteCode || !!item.znZone || !!item.devicetype) {
          return item.rgRegion.toLowerCase().includes(value) ||
            item.smSiteCode.toLowerCase().includes(value) ||
            item.znZone.toLowerCase().includes(value) ||
            item.devicetype.toLowerCase().includes(value);
        }
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }

}
