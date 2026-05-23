import { LITHIUM_COLUMNS_1_TO_15 } from '../lith-latestdata.enum';
import { LITHIUM_COLUMNS_16_TO_32 } from '../lith-latestdata-16-32.enum';

import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { LithiumService } from '../../../shared/services/lithium.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';
import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';
import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-lith-latestdata-part2',
  templateUrl: './lith-latestdata-part2.component.html',
  styleUrls: ['./lith-latestdata-part2.component.scss']
})
export class LithLatestdataPart2Component implements OnInit, OnDestroy {
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

    this.lithiumService.getLithiumPart2().subscribe(
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
        this.util.notification.error({ title: 'Error', msg: 'Failed to load Lithium Battery Data (Cells 16-32)' });
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
    XLSX.writeFile(wb, `lithium-battery-data-part2.${type}`);
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
      // Add base columns (site info)
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_16_TO_32['smSitecode'], userIndex: 0 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_16_TO_32['lastUpdated'], userIndex: 1 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_16_TO_32['clusterName'], userIndex: 2 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_16_TO_32['sitetypeid'], userIndex: 3 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_16_TO_32['zone'], userIndex: 4 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_16_TO_32['region'], userIndex: 5 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_16_TO_32['powersource'], userIndex: 6 });
      this.sampleData.columnHeader.push({ ...LITHIUM_COLUMNS_16_TO_32['deviceType'], userIndex: 7 });
      
      // Add all battery data columns from the response
      Object.keys(res[0]).forEach((key, idx) => {
        // Check if the key starts with battery data patterns for cells 16-32
        if (key.match(/^(liBattVoltage|liBattCurrent|liSOC|liSOH|liBattTemp)(1[6-9]|2[0-9]|3[0-2])$/)) {
          // Use the column definition from enum if available, otherwise create a basic one
          if (LITHIUM_COLUMNS_16_TO_32[key]) {
            this.sampleData.columnHeader.push(LITHIUM_COLUMNS_16_TO_32[key]);
          } else {
            // Extract the type and number from the key (e.g., 'Voltage', '16' from 'liBattVoltage16')
            const match = key.match(/^liBatt(Voltage|Current|Temp)|li(SOC|SOH)(\d+)$/);
            if (match) {
              const type = match[1] || match[2];
              const num = match[3];
              this.sampleData.columnHeader.push({
                userIndex: idx + 8,
                fieldName: key,
                colDisplayName: `${type} ${num}`,
                title: `Battery ${type} ${num}`,
                widthOfColumn: 130,
                colType: "text",
                dataType: "text",
                id: String(idx + 8),
                imgName: "",
                tooltipSrc: "",
                function: "",
                funParams: "",
                wrapData: "",
                isSortSupported: false,
                isCustomAttributeColumn: false
              });
            }
          }
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