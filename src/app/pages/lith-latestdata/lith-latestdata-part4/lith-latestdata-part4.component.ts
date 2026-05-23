import { LITHIUM_COLUMNS_49_TO_64 } from '../lith-latestdata-49-64.enum';

import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { LithiumService } from '../../../shared/services/lithium.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';
import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';
import { AppConstant } from '../../../shared/app-constant.enum';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-lith-latestdata-part4',
  templateUrl: './lith-latestdata-part4.component.html',
  styleUrls: ['./lith-latestdata-part4.component.scss']
})
export class LithLatestdataPart4Component implements OnInit, OnDestroy {
  public isExporting: boolean = false;
  public appType: number = 1;
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

    this.lithiumService.getLithiumPart4().subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res && res.data) {
          this.manipulate(res.data);
          this.setRowData(res.data);
        } else {
          this.manipulate(res);
          this.setRowData(res);
        }
        setTimeout(() => this.tableListingComponent.init());
      },
      (err) => {
        this.isLoading = false;
        this.isListServerError = true;
        this.util.notification.error({ title: 'Error', msg: 'Failed to load Lithium Battery Data (Cells 49-64)' });
      }
    );
  }

  exportExcel(evt?: any): void {
    evt?.stopPropagation();
    evt?.preventDefault();
    this.exportTableToExcel('xlsx');
  }

  exportCSV(evt?: any): void {
    evt?.stopPropagation();
    evt?.preventDefault();
    this.exportTableToExcel('csv');
  }

  exportTableToExcel(type: string): void {
    const element = document.getElementById('export-data');
    if (!element) return;
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `lithium-battery-data-part4.${type}`);
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

  onRowSelectionChanged(data: any): void {}

  loadListing(data: any): void {
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
      // Add base columns
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_49_TO_64['smSitecode'], userIndex: 0 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_49_TO_64['lastUpdated'], userIndex: 1 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_49_TO_64['clusterName'], userIndex: 2 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_49_TO_64['sitetypeid'], userIndex: 3 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_49_TO_64['zone'], userIndex: 4 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_49_TO_64['region'], userIndex: 5 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_49_TO_64['powersource'], userIndex: 6 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_49_TO_64['deviceType'], userIndex: 7 });

      // Add battery data columns 49-64
      Object.keys(res[0]).forEach((key) => {
        if (key.match(/^(liBattVoltage|liBattCurrent|liSOC|liSOH|liBattTemp)(49|5[0-9]|6[0-4])$/)) {
          if (LITHIUM_COLUMNS_49_TO_64[key]) {
            this.sampleData.columnHeader.push(LITHIUM_COLUMNS_49_TO_64[key]);
          }
        }
      });
    }
  }

  setRowData(data: any[]): void {
    if (data && data.length) {
      let counter = 1;
      for (const item of data) {
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
