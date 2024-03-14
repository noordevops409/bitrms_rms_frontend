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

import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';

import { USERS_COLUMN_HEADER } from './users-column.enum';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
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

  private customerList: any = [];
  private customerRoleList: any = [];
  private userRoleList: any = [];
  private sampleData: any = {};
  private allData: any = {};
  private currentPageNo: number = 1;
  private pageSize: number = 10;
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
  countryList: any;

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
    this.loadCustomer();
    this.loadCustomerRole();
    this.loadUserRole();
    // this.loadCountry();
    // this.loadSiteType();
    // this.loadCustomer();
    setTimeout(() => {
      this.loadData();
    }, 1000);
  }

  listen() {
    this.forEditListener = this.broadcast.on<string>('OPEN_USER_MASTER_FOR_EDIT').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.edit(null, data);
      });
    });

    this.forDeleteListener = this.broadcast.on<string>('OPEN_USER_MASTER_FOR_DELETE').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.delete(data);
      });
    });
  }

  loadCustomer() {
    const url = ApiConstant.getCustomerNameList;
    this.httpClient.get(url).subscribe((data: any) => {
      if (data && data.customername && data.customername.length) {
        this.customerList = data.customername;
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading customer name list!'
      });
    });
  }

  loadCustomerRole() {
    const url = ApiConstant.getCustomerRoleList;
    this.httpClient.get(url).subscribe((data: any) => {
      if (data && data.customerrole && data.customerrole.length) {
        this.customerRoleList = data.customerrole;
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading customer role list!'
      });
    });
  }

  loadUserRole() {
    const url = ApiConstant.getRoleList;
    this.httpClient.get(url).subscribe((data: any) => {
      if (data && data.roleuser && data.roleuser.length) {
        this.userRoleList = data.roleuser;
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading user role list!'
      });
    });
  }

  setCustomer(req) {
    for (let item of this.customerList) {
      if (item.customerid == req.customerId) {
        req.customerName = item.customername;
        break;
      }
    }
  }

  setCustomerRole(req) {
    for (let item of this.customerRoleList) {
      if (item.customerroleid == req.customerRoleId) {
        req.customerRoleName = item.customerdesc;
        break;
      }
    }
  }

  setUserRole(req) {
    for (let item of this.userRoleList) {
      if (item.roleid == req.roleId) {
        req.roleName = item.rolename;
        break;
      }
    }
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


  loadData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let apiUrl: any = ApiConstant.getAllUserData;
    this.httpClient.post(apiUrl, null).subscribe((res: any) => {
      this.isLoading = false;
      this.status(res);
      this.loginType(res);
      this.manipulate(res);
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading user data!'
      })
    });
  }
  loginType(res: any) {
    res.usermasterlist.forEach((item: any) => {
      if (item.umAactivationstatus == 0) {
        item.umDescription = 'Active';
      } else {
        item.umDescription = 'Inactive';
      }
    });
  }
  status(res: any) {
    res.usermasterlist.forEach((item: any) => {
      if (item.umLoginType == 0) {
        item.umLoginTypeCountry = 'All';
      } else if (item.umLoginType == 1) {
        item.umLoginTypeCountry = 'Myanmar';
      }
      else {
        item.umLoginTypeCountry = 'Philippines';

      }
    });
  }

  manipulate(res) {
    this.setResponse(res.usermasterlist);
    this.setColumnHeader(res.usermasterlist);
    this.setRowData(res.usermasterlist);
    this.activeListing.list = this.sampleData;
    this.sampleData.totalDocs = res.totalCount || res.usermasterlist.length;
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo;
    this.sampleData.listingType = AppConstant.USER_LISTING_TYPE;
    this.sampleData.recordBatchSize = this.pageSize || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.retainNoOfShow = this.pageSize;
    this.sampleData.sortField = 'umID';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      this.sampleData.columnHeader.push(USERS_COLUMN_HEADER["srno"]);
      for (let key in rowData) {
        // if (key === 'customerId') {
        //   this.sampleData.columnHeader.push(USERS_COLUMN_HEADER['customerName']);
        // } else 
        if (key === 'customerRoleId') {
          this.sampleData.columnHeader.push(USERS_COLUMN_HEADER['customerRoleName']);
        } else if (key === 'roleId') {
          this.sampleData.columnHeader.push(USERS_COLUMN_HEADER['roleName']);
        } else if (USERS_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(USERS_COLUMN_HEADER[key]);
        }
      }
      this.sampleData.columnHeader.push(USERS_COLUMN_HEADER["delete"]);
    }
  }

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        counter += 1;
       // this.setCustomer(item);
        this.setCustomerRole(item);
        this.setUserRole(item);
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
    XLSX.writeFile(wb, `user-data.${type}`);

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
        // item.umName = item.umName.toString();
        // item.username = item.username.toString();
        // item.umEmailid = item.umEmailid.toString();
        // item.umMobileNumber = item.umMobileNumber.toString();
        if (!!item.umName || !!item.username || !!item.umEmailid || !!item.umMobileNumber) {
          return (
            item.umName && item.umName.includes(value) ||
            item.username && item.username.includes(value) ||
            item.umEmailid && item.umEmailid.includes(value) ||
            item.umMobileNumber && item.umMobileNumber.includes(value)
          );
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
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      width: '1000px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.usermasterlist && data.usermasterlist.length) {
          this.manipulate(data);
        } else {
          this.loadData();
        }
      }
    });
  }

  edit(evt?: any, item?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      width: '1000px',
      height: 'auto',
      data: item
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.usermasterlist && data.usermasterlist.length) {
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
      this.httpClient.post(ApiConstant.deleteUserDetails + `?umID=${item.umID}`, null).subscribe((data) => {
        this.util.notification.success({
          title: 'Success',
          msg: 'User details deleted successfully.'
        });
        this.loadData();
      }, (err) => {
        this.util.notification.error({
          title: 'Error',
          msg: 'Error while deleting user details!'
        })
      });
    }
  }
}
