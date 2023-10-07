import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { ApiConstant, AppConstant } from 'src/app/enums';

@Component({
  selector: 'app-dg-maintenance-alert',
  templateUrl: './dg-maintenance-alert.component.html',
  styleUrls: ['./dg-maintenance-alert.component.scss']
})
export class DgMaintenanceAlertComponent {

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


  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }
  tableData: any;
  tableData1: any;
  type: any="Dg Maintenance Alert";
  apiUrl: any;
  dataApi:any;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
     /// console.log('in the alert-table.component');
     // this.type = params.get('type');
     // console.log('line 23', this.type);
      this.loading = true; // Set loading to true before making the request
      this.getAlertsTableDataByType(); // Assign the observable
      
    });
  }
  goBack(): void {
    this.location.back();
  }
 

  private getAlertsTableDataByType() {
   
    
      this.apiUrl = `${ApiConstant.getDgMaintenanceAlerts}`; // Use backticks to create the template string
      console.log('line 23', this.apiUrl);
  
      // const url = ApiConstant.getLatestData;
      this.httpClient.post(this.apiUrl,{}).subscribe((data) => {
        this.tableData1 = data;
        this.tableData=this.tableData1.datalist;
        console.log('API Response:', this.tableData1.datalist);
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
 exportOptSelected($event: any) {
  if (this.ddExport == 1) {
    this.exportToExcel();
  } else if (this.ddExport == 2) {
    this.exportToCSV();
  }
  setTimeout(() => {
    this.ddExport = -1;
  }, 2000); // 2000 milliseconds = 2 seconds


}

  exportToExcel() {
    // Select the table header and content elements
    const tblHeader = document.querySelector('.tbl-header') as HTMLTableElement;
    const tblContent = document.querySelector('.tbl-content table') as HTMLTableElement;
  
    if (!tblHeader || !tblContent) {
      console.error("Header or content element not found.");
      return;
    }
  
    // Create a new Workbook and add the Worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tblContent);
  
    // Get the header row data
    const headerData = Array.from(tblHeader.querySelectorAll('th')).map(cell => cell.textContent);
  
    // Get the existing content rows
    const existingContentRows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });
  
    // Create a copy of the existing content rows array
    const modifiedContentRows = [...existingContentRows];
  
    // Add the header data only if it doesn't match the first row of content
    if (!headerData.every((value, index) => value === modifiedContentRows[0][index])) {
      modifiedContentRows.unshift(headerData);
    }
  
    // Write the modified content back to the worksheet
    XLSX.utils.sheet_add_json(ws, modifiedContentRows, { skipHeader: true, origin: "A1" });
  
    // Add the Worksheet to the Workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Create a Blob object to save the Excel file
    const blob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  
    // Create a download link for the Blob and simulate a click event to trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.type,'exported_data.xlsx';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
 
  }
  
  exportToCSV() {
    // Select the table header and content elements
    const tblHeader = document.querySelector('.tbl-header') as HTMLTableElement;
    const tblContent = document.querySelector('.tbl-content table') as HTMLTableElement;
  
    if (!tblHeader || !tblContent) {
      console.error("Header or content element not found.");
      return;
    }
  
    // Get the header row data
    const headerData = Array.from(tblHeader.querySelectorAll('th')).map(cell => cell.textContent);
  
    // Get the existing content rows
    const existingContentRows: any[] = Array.from(tblContent.querySelectorAll('tr')).map(row => {
      return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent);
    });
  
    // Create a CSV content string
    const csvContent = [headerData.join(',')];
    existingContentRows.forEach(row => {
      csvContent.push(row.join(','));
    });
  
    // Create a Blob object to save the CSV file
    const blob = new Blob([csvContent.join('\n')], {
      type: 'text/csv'
    });
  
    // Create a download link for the Blob and simulate a click event to trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.type,'exported_data.csv';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
  

}
