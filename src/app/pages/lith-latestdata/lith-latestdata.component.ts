import { LITHIUM_COLUMNS_1_TO_15 } from './lith-latestdata.enum';

import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';
import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';
import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';
import { LithiumService } from '../../shared/services/lithium.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-lith-latestdata',
  templateUrl: './lith-latestdata.component.html',
  styleUrls: ['./lith-latestdata.component.scss']
})
export class LithLatestdataComponent implements OnInit, OnDestroy {
  public isExporting: boolean = false;
  public appType: number = 1; // or use AppConstant.RAW_DATA_REPORT_APP_TYPE if defined
  public listingTemplate: any = {};
  
  @ViewChild(TableListingComponent, { static: true }) public tableListingComponent!: TableListingComponent;

  public isLoading = false;
  public isListServerError = false;
  public list = [];
  public data: any;
  public activeListing: any = {};
  public sampleData: any = {};
  public allData: any = {};
  public currentPageNo = 1;
  public pageSize = 10;
  public recordStartFrom = 0;

  private forEditListener!: Subscription;
  private forDeleteListener!: Subscription;

  constructor(
    private dialog: MatDialog,
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private ngZone: NgZone,
    private lithiumService: LithiumService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.forEditListener) this.forEditListener.unsubscribe();
    if (this.forDeleteListener) this.forDeleteListener.unsubscribe();
  }

  loadData(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    this.lithiumService.getLithiumPart1().subscribe(
      (res: any) => {
        this.isLoading = false;
        // Check if response has data property (API returns {message, data, status})
        if (res && res.data) {
          this.manipulate(res.data);
          this.setRowData(res.data);
        } else {
          // Handle direct array response
          this.manipulate(res);
          this.setRowData(res);
        }
        setTimeout(() => this.tableListingComponent.init());
      },
      (err) => {
        this.isLoading = false;
        this.isListServerError = true;
        this.util.notification.error({ title: 'Error', msg: 'Failed to load Lithium Battery Data' });
      }
    );
  }

  exportExcel(evt?: any): void {
    evt?.stopPropagation();
    evt?.preventDefault();
    this.exportTableToExcel("xlsx");
  }
  
  exportCSV(evt?: any): void {
    evt?.stopPropagation();
    evt?.preventDefault();
    this.exportTableToExcel("csv");
  }
  
  exportTableToExcel(type: string): void {
    let element = document.getElementById('export-data');
    if (!element) return;
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `lithium-battery-data.${type}`);
  }
  
  searchGlobally(event: any): void {
    let { value } = event.target;
    value = value.toLowerCase();
    if (value && this.allData.data) {
      this.sampleData.data = this.allData.data.filter((item: any) => {
        return item.smSitecode?.toLowerCase().includes(value);
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }
  
  onRowSelectionChanged(data: any): void {
    // You can define selected row logic here if needed
  }
  
  loadListing(data: any): void {
    // Refresh data on selection change (pagination/filtering)
    this.loadData();
  }
  

  manipulate(res: any): void {
    this.sampleData.listingType = AppConstant.REMOTE_COMMANDS_LISTING_TYPE;
    this.sampleData.currentPageNo = this.currentPageNo;
    this.sampleData.recordBatchSize = this.pageSize;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.retainNoOfShow = this.pageSize;
    this.sampleData.sortField = 'smSitecode';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
    this.setColumnHeader(res);
    this.activeListing.list = this.sampleData;
    this.sampleData.totalDocs = res.length;
  }

  setColumnHeader(res: any[]): void {
    this.sampleData.columnHeader = [];
    if (res && res.length) {
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_1_TO_15['smSitecode'], userIndex: 0 });
      Object.keys(res[0]).forEach((key, idx) => {
        if (LITHIUM_COLUMNS_1_TO_15[key]) {
          this.sampleData.columnHeader.push(LITHIUM_COLUMNS_1_TO_15[key]);
        }
      });
    }
  }

  setRowData(data: any[]): void {
    if (data && data.length) {
      let counter = 1;
      for (let item of data) {
        item.srno = counter++;
      }
      this.sampleData.data = data;
      this.allData.data = data;
    } else {
      this.sampleData.data = [];
      this.allData.data = [];
    }
  }
}
