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

import { AddSiteComponent } from './add-site/add-site.component';

import { SITE_COLUMN_HEADER } from './site-column.enum';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {

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

  private clusterList: any = [];
  private simList: any = [];
  private customerList: any = [];
  private employeeList: any = [];
  private sampleData: any = {};
  private allData: any = {};
  private currentPageNo: number = 1;
  private pageSize: number = 100;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  private forEditListener!: Subscription;
  private forDeleteListener!: Subscription;

  public siteTypeList: any = [
    {
      value: 1,
      label: 'Hybrid'
    },
    {
      value: 2,
      label: 'TEE'
    }
  ];

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
    this.loadCluster();
    this.loadSim();
    this.loadEmployee();
    // this.loadSiteType();
    // this.loadCustomer();
    setTimeout(() => {
      this.loadData();
    }, 1000);
  }

  listen() {
    this.forEditListener = this.broadcast.on<string>('OPEN_SITE_MASTER_FOR_EDIT').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.edit(null, data);
      });
    });

    this.forDeleteListener = this.broadcast.on<string>('OPEN_SITE_MASTER_FOR_DELETE').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.delete(data);
      });
    });
  }

  loadCluster() {
    let url = ApiConstant.getClusterMasterData;
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
        const userData = JSON.parse(userDataString); // Parse the userData JSON string from localStorage
        if (userData && userData.countryID) {
            url += `?countryId=${userData.countryID}`; 
        }
    }
    
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.clusterMasterList && data.clusterMasterList.length) {
        this.clusterList = data.clusterMasterList;
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading cluster list!'
      });
    });
  }

  loadSim() {
    const url = ApiConstant.getSimMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.simMasterList && data.simMasterList.length) {
        this.simList = data.simMasterList;
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading sim list!'
      });
    });
  }

  loadSiteType() {
    const url = ApiConstant.getSiteType;
    this.httpClient.get(url).subscribe((data: any) => {
      this.siteTypeList = data;
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading site type list!'
      });
    });
  }

  loadCustomer() {
    const url = ApiConstant.getCustomerMaster;
    this.httpClient.get(url).subscribe((data: any) => {
      this.customerList = data;
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading customer list!'
      });
    });
  }

  loadEmployee() {
    const url = ApiConstant.getEmployeeMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.employeeMasterList && data.employeeMasterList.length) {
        this.employeeList = data.employeeMasterList;
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading employee list!'
      });
    });
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.getSiteMasterData;
  
    this.httpClient.post(apiUrl, null).subscribe(
      (res: any) => {
        this.isLoading = false;
        res.siteMasterList.forEach((item: any) => {
          if (item.smSitetypeid == 1) {
            item.siteTypeValue = 'Hybrid';
          } else {
            item.siteTypeValue = 'TEE';
          }
        });
        this.manipulate(res);
        setTimeout(() => {
          this.tableListingComponent.init();
        });
      },
      (err) => {
        this.isLoading = false;
        this.isListServerError = true;
        this.util.notification.error({
          title: 'Error',
          msg: 'Error while loading Raw Data Report details!'
        });
      }
    );
  }
  

  manipulate(res) {
    this.setResponse(res.siteMasterList);
    this.setColumnHeader(res.siteMasterList);
    this.setRowData(res.siteMasterList);
    this.activeListing.list = this.sampleData;
    this.sampleData.totalDocs = res.totalCount || res.siteMasterList.length;
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo;
    this.sampleData.listingType = AppConstant.SITE_MASTER_LISTING_TYPE;
    this.sampleData.recordBatchSize = this.pageSize || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.retainNoOfShow = this.pageSize;
    this.sampleData.sortField = 'smSitecode';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      // this.sampleData.columnHeader.push(LATEST_DATA1_COLUMN_HEADER['checkbox']);
      this.sampleData.columnHeader.push(SITE_COLUMN_HEADER["srno"]);
      for (let key in rowData) {
        // if (key === 'smSitetypeid') {
        //   this.sampleData.columnHeader.push(SITE_COLUMN_HEADER["siteType"]);
        // }
         if (key === 'crClusterID') {
          this.sampleData.columnHeader.push(SITE_COLUMN_HEADER["clusterName"]);
        } if (key === 'smTechEmpid') {
          this.sampleData.columnHeader.push(SITE_COLUMN_HEADER["employeeId"]);
        } if (key === 'simID') {
          this.sampleData.columnHeader.push(SITE_COLUMN_HEADER["simNumber"]);
        } else if (SITE_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(SITE_COLUMN_HEADER[key]);
        }
      }
      this.sampleData.columnHeader.push(SITE_COLUMN_HEADER["delete"]);
    }
  }

  setSiteType(req?: any) {
    for (let item of this.siteTypeList) {
      if (item.value === req.smSitetypeid) {
        req.siteType = item.label;
        break;
      }
    }
  }

  setSim(req?: any) {
    for (let item of this.simList) {
      if (item.simID === req.simID) {
        req.simNumber = item.simNumber;
        break;
      }
    }
  }

  setCluster(req?: any) {
    for (let item of this.clusterList) {
      if (item.crClusterID === req.crClusterID) {
        req.clusterName = item.crName;
        break;
      }
    }
  }

  setEmployeeId(req?: any) {
    for (let item of this.employeeList) {
      if (item.emEmpID === req.smTechEmpid) {
        req.employeeId = item.emEmployeeID;
        break;
      }
    }
  }

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        counter += 1;
        this.setSiteType(item);
        this.setSim(item);
        this.setCluster(item);
        this.setEmployeeId(item);
        item.srno = counter;
        item.delete = 'Delete';
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
    XLSX.writeFile(wb, `site-data.${type}`);

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
        return (item.smSitecode.toLowerCase().includes(value) || item.smSitename.toLowerCase().includes(value));
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }

  add(evt?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddSiteComponent, {
      width: '1000px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.siteMasterList && data.siteMasterList.length) {
          this.manipulate(data);
        } else {
          this.loadData();
        }
      }
    });
  }

  edit(evt?: any, item?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddSiteComponent, {
      width: '1000px',
      height: 'auto',
      data: item
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.siteMasterList && data.siteMasterList.length) {
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
      this.httpClient.post(ApiConstant.deleteSiteMasterData + `?smSiteID=${item.smSiteID}`, null).subscribe((data) => {
        this.util.notification.success({
          title: 'Success',
          msg: 'Site details deleted successfully.'
        });
        this.loadData();
      }, (err) => {
        this.util.notification.error({
          title: 'Error',
          msg: 'Error while deleting site details!'
        })
      });
    }
  }

}
