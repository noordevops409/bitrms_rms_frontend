import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiConstant } from '../../api-constant.enum';
import { Observable } from 'rxjs';
import { AppConstant } from '../../app-constant.enum';
import { Location } from '@angular/common';


@Component({
  selector: 'app-alerts-table',
  templateUrl: './alerts-table.component.html',
  styleUrls: ['./alerts-table.component.scss']
})
export class AlertsTableComponent {

  isOpenTabularFilter: any;
  activeListing: any = {};
  public listingTemplate: any = {};
  public appType1: Number = AppConstant.ALARM_STATUS_APP_TYPE;
  private isMultipleRowSelected: boolean = false;
  private multipleSelRow: any;
  private selectedRow: any;
  currentPageNo: any;
  globalFilterValue: string = '';
  pageSize: any;
  recordStartFrom: any;
  isReqToOpenFilter: boolean = false; filterParam!: { siteId: any; clusters: any; zones: any; regions: any; deviceType: any; siteStatus: any[]; siteType: any; customers: any; date: any; };
  ddExport: any = -1;
  loading: boolean = true;
  ;

  exportOptSelected($event: any) {
    throw new Error('Method not implemented.');
  }
  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }
  tableData: any;
  tableData1: any;
  type: any;
  apiUrl: any;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log('in the alert-table.component');
      this.type = params.get('type');
      console.log('line 23', this.type);
      this.loading = true; // Set loading to true before making the request
      this.getAlertsTableDataByType(this.type); // Assign the observable
    });
  }
  goBack(): void {
    this.location.back();
  }

  private getAlertsTableDataByType(type: any) {
    this.apiUrl = `${ApiConstant.getAlertsDetails}/${type}`; // Use backticks to create the template string
    console.log('line 23', this.apiUrl);

    // const url = ApiConstant.getLatestData;
    this.httpClient.get(this.apiUrl).subscribe((data) => {
      this.tableData1 = data;
      console.log('API Response:', data);
      this.loading = false; // Set loading to false once data is fetched
    });
  }

  onRowSelectionChanged(data: any) {
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
  loadListing(data: any) {
    this.updateListParam(data);
  }
  updateListParam(data: any) {
    this.currentPageNo = data.currentPageNo ? (data.currentPageNo - 1) : this.currentPageNo;
    this.pageSize = data.pageSize || this.pageSize;
    this.recordStartFrom = data.recordStartFrom || this.recordStartFrom;

    // if (data && data.popupTo) {
    //   this.applyFilter(data);
    // } else {
    //   this.loadTowerLatestData();
    // }
  }

  handleResize() {
    const tblContent = document.querySelector('.tbl-content') as HTMLDivElement;
    const tblTable = tblContent.querySelector('table') as HTMLDivElement;
    const scrollWidth = tblContent.offsetWidth - tblTable.offsetWidth;
    const tblHeader = document.querySelector('.tbl-header') as HTMLDivElement;
    tblHeader.style.paddingRight = scrollWidth + 'px';
  }
  searchGlobally($event: any) {
    const filterValue = this.globalFilterValue.toLowerCase();
    this.tableData1 = this.tableData1.filter((item: any[]) => {
      // Loop through each column value and check if it contains the filter value
      return item.some((value: any) => value.toString().toLowerCase().includes(filterValue));
    });
  }

}