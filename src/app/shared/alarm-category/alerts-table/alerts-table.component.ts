import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiConstant } from '../../api-constant.enum';
import { Observable } from 'rxjs';
import { AppConstant } from '../../app-constant.enum';
import { DatePipe } from '@angular/common';

import { Location } from '@angular/common';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-alerts-table',
  templateUrl: './alerts-table.component.html',
  styleUrls: ['./alerts-table.component.scss'],
  providers: [DatePipe]
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
  showNoRecordsFoundMessage: boolean=false;
  ;
  


  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }
  tableData: any;
  tableData1: any;
  tableData2: any;

  type: any;
  apiUrl: any;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private location: Location,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
  
      this.type = params.get('type');
      this.loading = true; 
      this.getAlertsTableDataByType(this.type); 
      
    });
  }
  goBack(): void {
    this.location.back();
  }

  private getAlertsTableDataByType(type: any) {
    if (type == "Community Load") {
      this.apiUrl = ApiConstant.getSuperCriticalAlerts;
      this.httpClient.get<any[]>(this.apiUrl).subscribe((data) => {
        console.log("line 68", data);
        this.tableData1 = this.formatDateInData(data);
        this.tableData2 =  this.tableData1;
        this.loading = false;
      });
    }
    else
    {
    this.apiUrl = `${ApiConstant.getAlertsDetails}/${type}`; 
    this.httpClient.get<any[]>(this.apiUrl).subscribe((data) => {
            this.tableData1 = this.formatDateInData1(data,type);;
            this.tableData2 =  this.tableData1;      
            this.loading = false; 
    });
  }
}

formatDateInData(data: any[]): any[] {
  return data.map(item => {
    // Assuming the date field is always at index 3
    item[3] = this.formatDate(item[3]);
    return item;
  });
}
formatDateInData1(data: any[],type:any): any[] {
  return data.map(item => {
    if(type=="fuellvl"){
    // Assuming the date field is always at index 3
    item[3] = this.formatDate(item[3]);
    item[5] = this.formatDate(item[5]);
    }
    else if(type=="dgcount"    )
    {
      item[4] = this.formatDate(item[4]);

    }

    return item;
  });
}

formatDate(date: string): string {
  return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss') || '';
}

  onRowSelectionChanged(data: any) {
    if (data && data.length) {
      this.isMultipleRowSelected = data.length > 1;
      this.multipleSelRow = data;
      if (this.isMultipleRowSelected) {
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

  searchGlobally(event: any) {
    try {
        let { value } = event.target;
        value = value.trim().toLowerCase(); // Trim leading and trailing spaces
        
        // Reset the tableData1 to its original state
        this.resetTableData();
        
        if (!value) {
            // If the search input is empty, no need to filter
            return;
        }

        const searchTerms = value.split(/\s+/); // Split the input value into individual words
        //console.log("searchTerms",searchTerms)
       // console.log("this.tableData1",this.tableData1); 

        const filteredData = this.tableData1.filter((item: any) => {
          if (this.type === "fuellvl" || this.type === "Community Load") {
              return item[1].toLowerCase().includes(searchTerms);
          } else {
              return item[2].toLowerCase().includes(searchTerms) ||
                     item[3].toLowerCase().includes(searchTerms);
          }
      });
      
            // Check if any of the third or fourth elements of the object array contain the search term
       

        if (filteredData.length === 0) {
            // If no matching values found, reset tableData1 and display "No records found" message
            console.log("141");
            this.tableData1=null;
            //this.resetTableData();
            // Show "No records found" message in the UI
            this.showNoRecordsFoundMessage = true;
        } else {
          console.log("145");
            // Update tableData1 with filtered data and hide "No records found" message
            this.tableData1 = filteredData;
            this.showNoRecordsFoundMessage = false;
        }
        
    } catch (error) {
        console.error('Error during global filtering:', error);
    }
}

  resetTableData() {
    this.tableData1=this.tableData2;
  }

 exportOptSelected($event: any) {
  if (this.ddExport == 1) {
    this.exportToExcel();
  } else if (this.ddExport == 2) {
    this.exportToCSV();
  }
  setTimeout(() => {
    this.ddExport = -1;
  }, 500); 
}

  exportToExcel() {
    const tblHeader = document.querySelector('.tbl-header') as HTMLTableElement;
    const tblContent = document.querySelector('.tbl-content table') as HTMLTableElement;
  
    if (!tblHeader || !tblContent) {
      console.error("Header or content element not found.");
      return;
    }
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tblContent);
  
    const headerData = Array.from(tblHeader.querySelectorAll('th')).map(cell => cell.textContent);
    
    const existingContentRows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });
  
    const modifiedContentRows = [...existingContentRows];
  
    if (!headerData.every((value, index) => value === modifiedContentRows[0][index])) {
      modifiedContentRows.unshift(headerData);
    }
  
    XLSX.utils.sheet_add_json(ws, modifiedContentRows, { skipHeader: true, origin: "A1" });
  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const blob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.type,'exported_data.xlsx';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
 
  }
  
  exportToCSV() {
    const tblHeader = document.querySelector('.tbl-header') as HTMLTableElement;
    const tblContent = document.querySelector('.tbl-content table') as HTMLTableElement;
  
    if (!tblHeader || !tblContent) {
      console.error("Header or content element not found.");
      return;
    }
  
    const headerData = Array.from(tblHeader.querySelectorAll('th')).map(cell => cell.textContent);
  
    const existingContentRows: any[] = Array.from(tblContent.querySelectorAll('tr')).map(row => {
      return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent);
    });
  
    const csvContent = [headerData.join(',')];
    existingContentRows.forEach(row => {
      csvContent.push(row.join(','));
    });
  
    const blob = new Blob([csvContent.join('\n')], {
      type: 'text/csv'
    });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.type,'exported_data.csv';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
  
  
}  