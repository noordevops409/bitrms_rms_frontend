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

import { EMPLOYEE_COLUMN_HEADER } from './employee-column.enum';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';

import { AddEmployeeComponent } from './add-employee/add-employee.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  @ViewChild(TableListingComponent, { static: true }) public tableListingComponent!: TableListingComponent;

  public isLoading: boolean = false;
  public isListServerError: boolean = false;

  public parentHeight: any = null;
  public selectedRow: any = null;
  public multipleSelRow: any = null;
  public list = [];
  public appType: Number = AppConstant.RAW_DATA_REPORT_APP_TYPE;

  public activeListing: any = {};
  public activeListing1: any = {};

  public data: any;
  public listingTemplate: any = {};

  public isReqToOpenFilter: boolean = false;
  public isOpenTabularFilter: boolean = false;
  public isExpanded: boolean = false;
  public defaultFilterList: any = [];

  public isFilterDataLoaded: boolean = false;

  private employeeRoleList: any = [];
  private regionList: any = [];
  private zoneList: any = [];
  private sampleData: any = {};
  private allData: any = {};
  private allData1: any = {};

  private currentPageNo: number = 1;
  private pageSize: number = 100;
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
    this.loadEmployeeRole();
    this.loadRegion();
    this.loadZone();
    setTimeout(() => {
      this.loadData();
      this.loadAllData();
    }, 1000);
   
  }

  listen() {
    this.forEditListener = this.broadcast.on<string>('OPEN_EMPLOYEE_FOR_EDIT').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.edit(null, data);
      });
    });

    this.forDeleteListener = this.broadcast.on<string>('OPEN_EMPLOYEE_FOR_DELETE').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.delete(data);
      });
    });
  }

  loadEmployeeRole() {
    const url = ApiConstant.getEmployeeRoleMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.employeeRoleMasterList && data.employeeRoleMasterList.length) {
        this.employeeRoleList = data.employeeRoleMasterList;
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading employee role list!'
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
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading region list!'
      });
    });
  }

  loadZone() {
    const url = ApiConstant.getZoneMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.zoneMasterList && data.zoneMasterList.length) {
        this.zoneList = data.zoneMasterList;
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading zone list!'
      });
    });
  }

  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.getEmployeeMasterData1 + `/pageNumber/${this.currentPageNo}/size/${this.pageSize}`;
     (window as any)['retainNoOfShow'] = this.pageSize;
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

  loadAllData()
  {
     let apiUrl: any = ApiConstant.getEmployeeMasterData1 ;
       this.httpClient.post(apiUrl, null).subscribe((res: any) => {
        this.setRowData1(res.employeeMasterList);
       })
     }
  
 
  
  manipulate(res) {
    this.setResponse(res.employeeMasterList);
    this.setColumnHeader(res.employeeMasterList);
    this.setRowData(res.employeeMasterList);
    this.activeListing.list = this.sampleData;
     this.activeListing1.list=this.allData1
    this.sampleData.totalDocs = res.totalCount ;
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo;
    this.sampleData.listingType = AppConstant.EMPLOYEE_MASTER_LISTING_TYPE;
    this.sampleData.recordBatchSize = this.pageSize || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.retainNoOfShow = this.pageSize;
    this.sampleData.sortField = 'emEmpID';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      // this.sampleData.columnHeader.push(LATEST_DATA1_COLUMN_HEADER['checkbox']);
      this.sampleData.columnHeader.push(EMPLOYEE_COLUMN_HEADER["srno"]);
      for (let key in rowData) {
        if (key === 'erRoleID') {
          this.sampleData.columnHeader.push(EMPLOYEE_COLUMN_HEADER["empRoleName"]);
        } else if (key === 'rgRegionID') {
          this.sampleData.columnHeader.push(EMPLOYEE_COLUMN_HEADER["regionName"]);
        } else if (key === 'znZoneID') {
          this.sampleData.columnHeader.push(EMPLOYEE_COLUMN_HEADER["zoneName"]);
        } else if (EMPLOYEE_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(EMPLOYEE_COLUMN_HEADER[key]);
        }
      }
      this.sampleData.columnHeader.push(EMPLOYEE_COLUMN_HEADER["delete"]);
    }
  }

  setEmployeeRole(req: any) {
    for (let item of this.employeeRoleList) {
      if (item.erRoleID === req.erRoleID) {
        req.empRoleName = item.erRoleName;
        break;
      }
    }
  }

  setRegion(req?: any) {
    for (let item of this.regionList) {
      if (item.rgRegionID === req.rgRegionID) {
        req.regionName = item.rgRegion;
        break;
      }
    }
  }

  setZone(req?: any) {
    for (let item of this.zoneList) {
      if (item.znZoneID === req.znZoneID) {
        req.zoneName = item.znZone;
        break;
      }
    }
  }

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        this.setEmployeeRole(item);
        this.setRegion(item);
        this.setZone(item);
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
  setRowData1(resData) {
    const data = resData || [];
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        this.setEmployeeRole(item);
        this.setRegion(item);
        this.setZone(item);
        counter += 1;
        item.srno = counter;
        item.delete = "Delete";
      }
      this.sampleData.data = data;
      this.allData1.data = data;
    } else {
      this.sampleData.data = [];
      this.allData1.data = [];
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
    XLSX.writeFile(wb, `employee-data.${type}`);

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
    
    //  let apiUrl: any = ApiConstant.getEmployeeMasterData1 ;
    //  setTimeout(() => {
     
    //   this.httpClient.post(apiUrl, null).subscribe((res: any) => {
    //     this.setRowData(res.employeeMasterList);
    //   })
    // }, 5000);
    

    let { value } = event.target;
    value = value.toLowerCase();
    
    if (value) {
  
      this.sampleData.data = this.allData1.data.filter((item) => {
       // console.log("lineeee",item);
        item.emEmployeeID = item.emEmployeeID.toString();
       // item.empRoleName = item.empRoleName.toString();
        item.emFirstName = item.emFirstName.toString();
        item.emLastName=item.emLastName.toString();
        return (item.emEmployeeID.toLowerCase().includes(value) ||
         // item.empRoleName.toLowerCase().includes(value)
         item.emLastName.toLowerCase().includes(value) ||
          item.emFirstName.toLowerCase().includes(value));
      });
    } else {
      this.sampleData.data = this.allData1.data;
    }
    this.activeListing.list = this.sampleData;
    // setTimeout(() => {
    //   this.loadAllData();
    // }, 1000);
    this.tableListingComponent.init();
  }

  add(evt?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '1000px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.employeeMasterList && data.employeeMasterList.length) {
          this.manipulate(data);
        } else {
          this.loadData();
          
          
        }
      }
      setTimeout(() => {
        this.loadAllData();
      }, 1000);
    });
  }

  edit(evt?: any, item?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '1000px',
      height: 'auto',
      data: item
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.employeeMasterList && data.employeeMasterList.length) {
          this.manipulate(data);
        } else {
          this.loadData();
        }
      }
      setTimeout(() => {
        this.loadAllData();
      }, 1000);
    });
  }

  delete(item?: any, i?: any) {
    var r = confirm("Are you sure you want to delete selected record");
    if (r) {
      this.httpClient.post(ApiConstant.deleteEmployeeMasterData + `?emEmpID=${item.emEmpID}`, null).subscribe((data) => {
        this.util.notification.success({
          title: 'Success',
          msg: 'Employee details deleted successfully.'
        });
        this.loadData();
      }, (err) => {
        this.util.notification.error({
          title: 'Error',
          msg: 'Error while deleting employee details!'
        })
      });
    }
  }

}
