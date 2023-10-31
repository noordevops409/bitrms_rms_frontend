import { Component, OnInit, ViewChild, OnDestroy, Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';

import { RAW_DATA_REPORT_COLUMN_HEADER } from './raw-data-report-column.enum';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';

import { TableListingComponent } from '../../../shared/table-listing/table-listing.component';
import * as moment from 'moment';
import { reject } from 'lodash';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-raw-data-report',
  templateUrl: './raw-data-report.component.html',
  styleUrls: ['./raw-data-report.component.scss']
})
export class RawDataReportComponent implements OnInit, OnDestroy {

  @ViewChild(TableListingComponent, { static: true }) public tableListingComponent!: TableListingComponent;

  public isLoading: boolean = false;
  public isListServerError: boolean = false;
  public isDownloading = false;


  public parentHeight: any = null;
  public selectedRow: any = null;
  public multipleSelRow: any = null;
  public list = [];
  public appType: Number = AppConstant.RAW_DATA_REPORT_APP_TYPE;

  public activeListing: any = {};
  public hasNoData: boolean = true;
  public data: any;
  public listingTemplate: any = {};
  public ddExport: any = "-1";
  public downloadProgress: number = 0;

  public exportData: any = {
    data: []
  };
  public isExporting: boolean = false;

  isReqToOpenFilter: boolean = false;
  isOpenTabularFilter: boolean = false;
  isExpanded: boolean = false;
  fetchClicked: boolean = false;
  selectedFormat: string = '-1';

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
    {
      id: 'FMF02',
      fieldName: 'zones',
      indexField: 'zones',
      labelName: 'Zone',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'zones',
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
      xhrUrl: ApiConstant.getZoneMaster,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'znZone',
        value: 'znZone'
      }
    },
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
     // isDisableMultipeSelection: true,
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
    {
      id: 'FMF05',
      fieldName: 'deviceType',
      indexField: 'deviceType',
      labelName: 'Device Type',
      dataType: 'Dropdown',
      popupTo: {
        recordBatchSize: 25,
        data: []
      },
      listingColumnFieldName: 'deviceType',
      data: [],
      isDataLoaded: false,
      isDynamic: true,
      isOpen: false,
      isReqRemove: false,
      xhrMethod: 'GET',
      xhrUrl: ApiConstant.getDeviceTypeMaster,
      xhrParam: [],
      isReqManipulate: true,
      isAllDataLoaded: true,
      maniObj: {
        id: 'deviceType',
        value: 'deviceType'
      }
    }
  ];

  public isFilterDataLoaded: boolean = false;
  public dropboxLink: any = '';

  private sampleData: any = {};
  private allData: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 100;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;

  private filterParam: any = {
    "allClusters": true,
    "allDeviceType": true,
    "allRegions": true,
    "allSiteId": true,
    "allSiteStatus": true,
    "allSiteTypes": true,
    "allZones": true,
    "anyFilterEmpty": true,
    "clusters": ["All"],
    "date": "2023/06/15 00:01:00 - 2023/06/16 23:54:00",
    "deviceType": ["All"],
    "draw": 5,
    "length": this.pageSize,
    "page": this.currentPageNo,
    "regions": ["All"],
    "siteId": ["All"],
    "siteStatus": 1,
    "siteType": ["All"],
    "start": this.recordStartFrom,
    "zones": ["All"]
  };

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient
  ) {

  }

  listen() {

  }

  ngOnInit(): void {
    let startDate = moment().add(-2, 'days').format('YYYY/MM/DD');
    let endDate = moment().add(-1, 'days').format('YYYY/MM/DD')
    this.filterParam.date = `${startDate} 00:00:00 - ${endDate} 23:59:00`;
    this.init();
  }

  ngOnDestroy() {

  }

  init() {
    // this.loadData();
    this.dropboxReportLink();
  }

  setDefaultFilter() {
    this.filterParam = {
      "allClusters": true,
      "allDeviceType": true,
      "allRegions": true,
      "allSiteId": true,
      "allSiteStatus": true,
      "allSiteTypes": true,
      "allZones": true,
      "anyFilterEmpty": true,
      "clusters": ["All"],
      "date": "2023/06/15 00:01:00 - 2023/06/16 23:54:00",
      "deviceType": ["All"],
      "draw": 5,
      "length": this.pageSize,
      "page": this.currentPageNo,
      "regions": ["All"],
      "siteId": ["All"],
      "siteStatus": 1,
      "siteType": ["All"],
      "start": this.recordStartFrom,
      "zones": ["All"]
    };
    let startDate = moment().add(-2, 'days').format('YYYY/MM/DD');
    let endDate = moment().add(-1, 'days').format('YYYY/MM/DD')
    this.filterParam.date = `${startDate} 00:00:00 - ${endDate} 23:59:00`;
  }

  fetchData(evt?: any) {
    // this.setDefaultFilter();
    this.loadData();
  }

  loadData(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isLoading) {
        reject("Loading is already in progress.");
        return;
      }

      

      this.isLoading = true;
      let apiUrl: any = ApiConstant.getRawDataReport + `/${this.currentPageNo}/size/${this.pageSize}`;
      this.httpClient.post(apiUrl, this.filterParam).subscribe(
        (res: any) => {
          this.isLoading = false;
          this.hasNoData = false;
          if (res && res.data) {
            this.manipulate(res);
            this.exportData.data = res.data;
            setTimeout(() => {
              this.tableListingComponent.init();
            });
            resolve(res.data); 
          }
        },
        (err) => {
          this.isLoading = false;
          this.hasNoData = false;
          this.isListServerError = true;
          this.util.notification.error({
            title: 'Error',
            msg: 'Error while loading Raw Data Report details!'
          });
          reject("Error while loading data: " + err); 
        }
      );
    });
  }


  manipulate(res) {
    
    this.setResponse(res);
    this.setColumnHeader(res.data);
    this.setRowData(res.data);
    this.activeListing.list = this.sampleData;
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo + 1;
    this.sampleData.listingType = AppConstant.RAW_DATA_REPORT_LISTING_TYPE;
    this.sampleData.recordBatchSize = 50 || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.sortField = 'rcaid';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
    this.sampleData.totalDocs = resData.recordsTotal || resData.length;
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      
      for (let key in rowData) {
        if (RAW_DATA_REPORT_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(RAW_DATA_REPORT_COLUMN_HEADER[key]);
        }
      }
    }
  }

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
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
    let regions: any = ['All'];
    let zones: any = ['All'];
    let clusters: any = ['All'];
    let siteId: any = ['All'];
    let deviceType: any = ['All'];
    let siteType: any = ['All'];
    let rangeDate: any = "";
    if (fData && fData.length) {
      if (fData[0].popupTo.data && fData[0].popupTo.data.length) {
        regions = fData[0].popupTo.data.map((item) => {
          return item.id;
        });
      }
      if (fData[1].popupTo.data && fData[1].popupTo.data.length) {
        zones = fData[1].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[2].popupTo.data && fData[2].popupTo.data.length) {
        clusters = fData[2].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[3].popupTo.data && fData[3].popupTo.data.length) {
        siteId = fData[3].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[4].popupTo.data && fData[4].popupTo.data.length) {
        deviceType = fData[4].popupTo.data.map((item) => {
          return item.id;
        });
      }

      if (fData[5] && fData[5].length) {
        siteType = fData[5].filter((item) => {
          return item.isChecked && item.text;
        }).map((item) => {
          return item.text;
        });
      }

      if (fData[6] && fData[6].startDate && fData[6].endDate) {
        rangeDate = fData[6].startDate.replace(/-/g, '/') + ' - ' + fData[6].endDate.replace(/-/g, '/');
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
      "siteStatus": 1,
      "siteType": siteType.length ? siteType : ['All'],
      "date": rangeDate,
      "allClusters": true,
      "allDeviceType": true,
      "allRegions": true,
      "allSiteId": true,
      "allSiteStatus": true,
      "allSiteTypes": true,
      "allZones": true,
      "anyFilterEmpty": true,
      "start": this.recordStartFrom,
      "draw": 5,
      "length": this.pageSize,
      "page": this.currentPageNo,
    };
  }

  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
    this.setFilterParam(evt);
    this.loadData();
  }
  applyFilterForExport(evt?: any) {
    this.isReqToOpenFilter = false;
    this.setFilterParam(evt);
    this.dropboxReportExcel();
  }
  updateListParam(data) {
    this.currentPageNo = data.currentPageNo ? (data.currentPageNo - 1) : this.currentPageNo;
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
        
      } else {
        this.selectedRow = data;
      }
    } else {
      this.multipleSelRow = null;
      this.selectedRow = null;
    }
  }

  searchGlobally(event) {
    let { value } = event.target;
    value = value.toUpperCase();
    if (value) {
      this.sampleData.data = this.allData.data.filter((item) => {
        if (!!item.smSiteID && !!item.smSitename) {
          return (item.smSiteID.includes(value) || item.smSitename.includes(value))
        }
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }

  exportTableToExcel(type: string): void {
    
    let element = document.getElementById('export-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    
    XLSX.writeFile(wb, `raw-data-report.${type}`);

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

    const selVal = this.ddExport;
    if (selVal === "1") {
      this.exportExcelApi(evt);
    } else if (selVal === "2") {
      this.exportCsvApi(evt);
    }
  }

  exportExcelApi(evt?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      let apiUrl: string = ApiConstant.getRawDataReportExcel;

      this.isDownloading = true;
      this.httpClient.post(apiUrl, this.filterParam, { responseType: 'arraybuffer' }).subscribe(
        (response: ArrayBuffer) => {
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'excel_data.xlsx'; 
          a.click();
          this.isDownloading = false;
          URL.revokeObjectURL(url);
        },
        (error: any) => {
          console.error('Error exporting Excel data:', error);
          
          this.isDownloading = false;
        }
      );
    });

  }

  exportCsvApi(evt: any) {
    return new Promise((resolve, reject) => {
      let apiUrl: string = ApiConstant.getRawDataReportCsv;

    this.isDownloading = true;
    this.httpClient.post(apiUrl, this.filterParam, { responseType: 'text' }).subscribe(
      (response: string) => {
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'csv_data.csv'; 
        a.click();

        this.isDownloading = false;
        URL.revokeObjectURL(url);
      },
      (error: any) => {
        console.error('Error exporting CSV data:', error);
        this.isDownloading = false;
      }
    );
  });
  }

  dropboxReportExcel11(evt?: any) {
    let apiUrl: string = ApiConstant.getRawDataReportExportRawRequest;
  this.isDownloading = true;
  this.httpClient.post(apiUrl, this.filterParam, { responseType: 'text' }).subscribe(
    (response: any) => {
      console.log('API call successful:', response);

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().replace(/[-T:\.Z]/g, '');
      const filename = `raw_data_export_${formattedDate}.csv`;

      // Create a data URI for the CSV content
      const dataURI = `data:text/csv;charset=utf-8,${encodeURIComponent(response)}`;

      

      this.util.notification.success({
        title: 'Success',
        msg: 'CSV Downloaded Successfully'
      });
      this.isDownloading = false;

    },
    (error) => {
      console.error('API call failed:', error);
      this.util.notification.warn({
        title: 'Warning',
        msg: 'Failed to Download CSV'
      });
      this.isDownloading = false;
    }
  );
  }
  
  dropboxReport(format: string, evt?: any) {
    console.log("format",format);
    if (format === '-1') {
      this.util.notification.error({
        title: 'Error',
        msg: 'Please Select Export Format'
      });
      return;
  }
    let apiUrl: string = ApiConstant.getRawDataReportExportRawRequest;

    this.httpClient.post(apiUrl, this.filterParam, { responseType: 'arraybuffer' }).subscribe(
      (response: any) => {
        console.log('API call successful:', response);

        let mimeType: string;
        let fileExtension: string;
       
       if (format === 'csv') {
          mimeType = 'text/csv';
          fileExtension = 'csv';
        } else if (format === 'excel') {
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileExtension = 'xlsx';
        } else {
          console.error('Unsupported file format:', format);
          return;
        }

        const blob = new Blob([response], { type: mimeType });
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace(/[-T:\.Z]/g, ''); 

        const filename = `raw_data_export_${formattedDate}.${fileExtension}`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; 
        document.body.appendChild(a);

        
        a.click();

        
        window.URL.revokeObjectURL(url);

        this.util.notification.success({
          title: 'Success',
          msg: 'Request Save Successfully'
        });
      },
      (error) => {
        
        console.error('API call failed:', error);

        this.util.notification.warn({
          title: 'Warning',
          msg: 'Failed to save the Request'
        });
      }
    );
}

    dropboxReportLink(evt?: any) {
      let apiUrl: string = ApiConstant.getRawDataReportDropboxLink;
      
      this.httpClient.get(apiUrl).subscribe(
        (response: any) => {
          
          console.log('API call successful:', response);
          this.dropboxLink = response.data.dropboxlink;
          console.log("line 657",this.dropboxLink)

          
          const dropboxLinkElement = document.getElementById('dropboxLink') as HTMLAnchorElement;
          
        },
        (error) => {
         
          console.error('API call error:', error);
        }
      );
    }
    goToLink() {
      window.open(this.dropboxLink, '_blank');
    }
   
  dropboxReportExcel(evt?: any): void {
  let apiUrl2=ApiConstant.getRawDataReportExportRawRequest;
  const requestBody = this.filterParam;
  this.isDownloading = true;
  this.httpClient.post(apiUrl2, requestBody, {
    responseType: 'blob'
  }).subscribe(
    (response: Blob) => {
      const blob = new Blob([response], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'downloaded_file.csv'; // Specify the desired file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      this.util.notification.success({
        title: 'Success',
        msg: 'CSV Downloaded Successfully'
      });
      this.isDownloading = false;
    },
    error => {
      console.error('Error downloading file:', error);
      this.util.notification.warn({
        title: 'Warning',
        msg: 'Failed to Download CSV'
      });
      // Handle error if needed
      this.isDownloading = false;

    }
  );
}
// dropboxReportExcel(evt?: any): void {
//   let apiUrl2 = ApiConstant.getRawDataReportExportRawRequest;
//   const requestBody = this.filterParam;
//   this.isDownloading = true;

//   // Get the current date and time
//   const currentDate = new Date();
//   const formattedDate = currentDate.toISOString().replace(/:/g, '-').replace(/\..*$/, ''); // Format as YYYY-MM-DDTHH-MM-SS

//   // Get the time in the format HH-MM-SS
//   const time = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;

//   // Modify the file name to include the date and time
//   const fileName = `raw_data_export_${formattedDate}_${time}.csv`;

//   this.httpClient.post(apiUrl2, requestBody, {
//     responseType: 'blob'
//   }).subscribe(
//     (response: Blob) => {
//       const blob = new Blob([response], { type: 'application/octet-stream' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = fileName; // Use the generated file name
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//       this.util.notification.success({
//         title: 'Success',
//         msg: 'CSV Downloaded Successfully'
//       });
//       this.isDownloading = false;
//     },
//     error => {
//       console.error('Error downloading file:', error);
//       this.util.notification.warn({
//         title: 'Warning',
//         msg: 'Failed to Download CSV'
//       });
//       // Handle error if needed
//       this.isDownloading = false;
//     }
//   );
// }

  
}
