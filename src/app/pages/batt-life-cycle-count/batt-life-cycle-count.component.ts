import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';

import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';
import { engineerNameList } from '../data/engineerName';
import { customerMaster } from '../data/customer-master';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';
import * as moment from 'moment';
import { BATT_LIFE_COLUMN_HEADER } from './batt-life-cycle-count-column.enum';
import { BATT_LIFE_REPORTS_COLUMN_HEADER } from './batt-life-cycle-reports-column.enum';

@Component({
  selector: 'app-batt-life-cycle-count',
  templateUrl: './batt-life-cycle-count.component.html',
  styleUrls: ['./batt-life-cycle-count.component.scss']
})
export class BattLifeCycleCountComponent implements OnInit {

  @ViewChild('lifetimeTable', { static: false }) lifetimeTableComponent!: TableListingComponent;
  @ViewChild('reportsTable', { static: false }) reportsTableComponent!: TableListingComponent;

  public isLoading: boolean = false;
  public isListServerError: boolean = false;
  private apiSubscription: Subscription | null = null;
  private loadRequestId: number = 0;

  public parentHeight: any = null;
  public selectedRow: any = null;
  public multipleSelRow: any = null;
  public list = [];
  public appType: Number = AppConstant.LATEST_DATA1_APP_TYPE;

  public activeListing: any = {};
  public data: any;
  public listingTemplate: any = {};
  
  // Separate data for Lifetime tab
  public lifetimeActiveListing: any = {};
  public lifetimeSampleData: any = { data: [] };
  public lifetimeAllData: any = { data: [] };
  
  // Separate data for Reports tab
  public reportsActiveListing: any = {};
  public reportsSampleData: any = { data: [] };
  public reportsAllData: any = { data: [] };

  isReqToOpenFilter: boolean = false;
  isOpenTabularFilter: boolean = false;
  isExpanded: boolean = false;
  changeUrl:boolean=false;
  isExporting: boolean = false;
  activeTab: string = 'lifetime';
  selectedReportType: string = 'daily';
  reportTypeOptions: any[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
  ];
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
    // {
    //   id: 'FMF05',
    //   fieldName: 'deviceType',
    //   indexField: 'deviceType',
    //   labelName: 'Device Type',
    //   dataType: 'Dropdown',
    //   popupTo: {
    //     recordBatchSize: 25,
    //     data: []
    //   },
    //   listingColumnFieldName: 'deviceType',
    //   data: [],
    //   isDataLoaded: false,
    //   isDynamic: true,
    //   isOpen: false,
    //   isReqRemove: false,
    //   xhrMethod: 'GET',
    //   xhrUrl: ApiConstant.getDeviceTypeMaster,
    //   xhrParam: [],
    //   isReqManipulate: true,
    //   isAllDataLoaded: true,
    //   maniObj: {
    //     id: 'deviceType',
    //     value: 'deviceType'
    //   }
    // },
    // {
    //   id: 'FMF06',
    //   fieldName: 'customers',
    //   indexField: 'customers',
    //   labelName: 'Customer',
    //   dataType: 'Dropdown',
    //   popupTo: {
    //     recordBatchSize: 25,
    //     data: []
    //   },
    //   listingColumnFieldName: 'customers',
    //   data: customerMaster,
    //   isDataLoaded: true,
    //   isDynamic: false,
    //   isOpen: false,
    //   isReqRemove: false,
    //   xhrMethod: 'GET',
    //   xhrUrl: null,
    //   xhrParam: [],
    //   isReqManipulate: true,
    //   isAllDataLoaded: true,
    //   maniObj: {
    //     id: 'id',
    //     value: 'value'
    //   }
    // },
    // {
    //   id: 'FMF07',
    //   fieldName: 'engineerName',
    //   indexField: 'engineerName',
    //   labelName: 'Engineer',
    //   dataType: 'Dropdown',
    //   popupTo: {
    //     recordBatchSize: 25,
    //     data: []
    //   },
    //   listingColumnFieldName: 'engineerName',
    //   data: engineerNameList,
    //   isDataLoaded: true,
    //   isDynamic: false,
    //   isOpen: false,
    //   isReqRemove: false,
    //   xhrMethod: 'GET',
    //   xhrUrl: null,
    //   xhrParam: [],
    //   isReqManipulate: true,
    //   isAllDataLoaded: true,
    //   maniObj: {
    //     id: 'id',
    //     value: 'value'
    //   }
    // }
  ];

  public isFilterDataLoaded: boolean = false;

  private sampleData: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;
  private allData: any = {};
 

  private filterParam: any = {
    "siteId": ['All'],
    "clusters": ['All'],
    "zones": ['All'],
    "regions": ['All'],
    "deviceType": ['All'],
    "siteType": ['All'],
    "siteStatus": ['All'],
    "customers": ['All'],
    "engineer": ['All'],
    "date": null,
    "startDate": moment().subtract(1, 'days').format("YYYY-MM-DD"),
    "endDate": moment().subtract(1, 'days').format("YYYY-MM-DD"),
    "reportMonth": null,
    "reportYear": null
  };

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
  }


  init() {
    // Don't load data automatically for reports tab
    // Only load data after user applies filters
    if (this.activeTab === 'lifetime') {
      this.loadData();
    }
  }


  getDefaultColumnName() {
    if (this.selectedReportType === 'monthly') {
      return 'Report Month';
    } else if (this.selectedReportType === 'yearly') {
      return 'Report Year';
    } else {
      // For daily and custom
      return 'Report Date';
    }
  }

  setDefaultFilter() {
    let startDate: string | undefined, endDate: string | undefined, reportMonth: string | null = null, reportYear: number | null = null;
    
    if (this.activeTab === 'reports') {
      if (this.selectedReportType === 'daily') {
        // For daily: show only yesterday's data
        const yesterday = moment().subtract(1, 'days');
        startDate = yesterday.format("YYYY-MM-DD");
        endDate = yesterday.format("YYYY-MM-DD");
      } else if (this.selectedReportType === 'monthly') {
        // For monthly: show current month's data
        const currentMonth = moment();
        startDate = currentMonth.startOf('month').format("YYYY-MM-DD");
        endDate = currentMonth.endOf('month').format("YYYY-MM-DD");
        reportMonth = currentMonth.format('YYYY-MM');
      } else if (this.selectedReportType === 'yearly') {
        // For yearly: show current year's data
        const currentYear = moment();
        startDate = currentYear.startOf('year').format("YYYY-MM-DD");
        endDate = currentYear.endOf('year').format("YYYY-MM-DD");
        reportYear = currentYear.year();
      }
    }
    
    this.filterParam = {
      "siteId": ['All'],
      "clusters": ['All'],
      "zones": ['All'],
      "regions": ['All'],
      "deviceType": ['All'],
      "siteType": ['All'],
      "siteStatus": ['All'],
      "customers": ['All'],
      "engineer": ['All'],
      "date": null,
      "startDate": startDate,
      "endDate": endDate,
      "reportMonth": reportMonth,
      "reportYear": reportYear
    };
  }

  loadData() {
    // Don't cancel previous requests - let them complete
    this.isLoading = true;
    this.isListServerError = false;
    this.sampleData = { data: [] };
    this.activeListing = { list: { data: [] } };
    this.allData = { data: [] };

    let url = '';
    if (this.activeTab === 'reports') {
      if (this.selectedReportType === 'daily') {
        url = ApiConstant.getDailyBattLifeCycle;
        this.filterParam.reportMonth = null;
        this.filterParam.reportYear = null;
      } else if (this.selectedReportType === 'monthly') {
        url = ApiConstant.getMonthlyBattLifeCycle;
        // Set reportMonth if not already set (e.g. on tab switch default)
        if (!this.filterParam.reportMonth) {
          this.filterParam.reportMonth = moment().format('YYYY-MM');
        }
        this.filterParam.reportYear = null;
      } else if (this.selectedReportType === 'yearly') {
        url = ApiConstant.getYearlyBattLifeCycle;
        // Set reportYear if not already set
        if (!this.filterParam.reportYear) {
          this.filterParam.reportYear = moment().year();
        }
        this.filterParam.reportMonth = null;
      } else if (this.selectedReportType === 'custom') {
        url = ApiConstant.getDailyBattLifeCycle;
        this.filterParam.reportMonth = null;
        this.filterParam.reportYear = null;
      }
    } else {
      url = ApiConstant.getBattLifeCycleCount;
      if (this.changeUrl) {
        url = ApiConstant.getBattLifeCycleCountRecords;
      }
    }

    const currentRequestId = ++this.loadRequestId;

    this.apiSubscription = this.httpClient.post(url, this.filterParam).subscribe((data: any) => {
      // Process all responses - don't discard any
      this.isLoading = false;
      this.apiSubscription = null;
      if (this.activeTab === 'reports') {
        this.manipulateReports(data);
      } else {
        this.manipulate(data);
      }
      setTimeout(() => {
        if (this.activeTab === 'reports' && this.reportsTableComponent) {
          this.reportsTableComponent.init();
        } else if (this.activeTab === 'lifetime' && this.lifetimeTableComponent) {
          this.lifetimeTableComponent.init();
        }
      });
    }, (err) => {
      // Process all errors - don't discard any
      this.isLoading = false;
      this.apiSubscription = null;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading data!'
      });
    });

    // Fallback timeout (60 seconds)
    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        if (this.apiSubscription) {
          this.apiSubscription.unsubscribe();
          this.apiSubscription = null;
        }
        this.util.notification.warn({
          title: 'Warning',
          msg: 'Request timed out. Please try again with a smaller date range or fewer filters.'
        });
      }
    }, 60000);
    this.changeUrl = false;
  }

  manipulate(data) {
    this.setResponse(data.data);
    this.setColumnHeader(data.data);
    this.setRowData(data.data);
    this.activeListing.list = this.sampleData;
  }

  manipulateReports(data) {
    let transformedData = data.data;
    if (data.data && data.data.length > 0 && Array.isArray(data.data[0])) {
      transformedData = this.transformArrayToObjects(data.data);
    }
    this.setResponse(transformedData);
    this.setReportsColumnHeader(transformedData);
    this.setReportsRowData(transformedData);
    this.activeListing.list = this.sampleData;
  }

  transformArrayToObjects(arrayData) {
    const fieldNames = [
      'srno', 'siteId', 'region', 'regionName', 'cluster', 'siteCode', 'siteName',
      'customerId', 'customerName', 'siteTypeId', 'siteTypeName', 'powerSourceId',
      'powerSourceName', 'reportDate', 'reportMonth', 'reportYear', 'startDateTime',
      'endDateTime', 'initialBatteryLifeCycleCount', 'finalBatteryLifeCycleCount',
      'totalBatteryCycleLifeCount'
    ];
    return arrayData.map((row, index) => {
      const obj: any = {};
      fieldNames.forEach((fieldName, i) => {
        obj[fieldName] = row[i] || '';
      });
      return obj;
    });
  }

  setReportsColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    
    // Always add the reportDate column first with dynamic name
    const reportDateColumn = { ...BATT_LIFE_REPORTS_COLUMN_HEADER.reportDate };
    reportDateColumn.colDisplayName = this.getDefaultColumnName();
    reportDateColumn.title = this.getDefaultColumnName();
    this.sampleData.columnHeader.push(reportDateColumn);
    
    if (colData.length) {
      const rowData = colData[0];
      
      // Add other columns in order, skipping srno and reportDate (already added)
      const orderedKeys = ['region', 'cluster', 'siteCode', 'siteName', 'initialBatteryLifeCycleCount', 'finalBatteryLifeCycleCount', 'totalBatteryCycleLifeCount'];
      
      for (let key of orderedKeys) {
        if (BATT_LIFE_REPORTS_COLUMN_HEADER[key]) {
          const columnHeader = { ...BATT_LIFE_REPORTS_COLUMN_HEADER[key] };
          this.sampleData.columnHeader.push(columnHeader);
        }
      }
    }
  }

  setResponse(resData) {
    this.sampleData.currentPageNo = this.currentPageNo + 1;
    this.sampleData.listingType = AppConstant.BATT_LIFE_LISTING_TYPE;
    this.sampleData.recordBatchSize = 50 || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.sortField = 'smSiteID';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
    this.sampleData.totalDocs = resData.totalElements || resData.length;
  }

  setColumnHeader(resData) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      // Skip srno column - don't add it to headers
      for (let key in rowData) {
        if (key !== 'srno' && BATT_LIFE_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(BATT_LIFE_COLUMN_HEADER[key]);
        }
      }
    }
  }

  setRowData(resData) {
    const data = resData || [];
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        counter += 1;
        item.srno = counter;
        // item.delete = "Delete";
      }
      this.sampleData.data = data;
      this.allData.data = data;
    } else {
      this.sampleData.data = [];
      this.allData.data = [];
    }
  }

  setReportsRowData(resData) {
    const data = resData || [];
    
    if (data.length) {
      let counter = 0;
      for (let item of data) {
        counter += 1;
        item.srno = counter;
        
        // Transform reportDate based on report type for UI display
        if (this.selectedReportType === 'monthly') {
          // For monthly reports, show month name (e.g., "March 2026")
          if (item.reportDate) {
            item.reportDate = moment(item.reportDate).format('MMMM YYYY');
          } else if (this.filterParam.startDate) {
            item.reportDate = moment(this.filterParam.startDate).format('MMMM YYYY');
          }
        } else if (this.selectedReportType === 'yearly') {
          // For yearly reports, show year (e.g., "2026")
          if (item.reportDate) {
            item.reportDate = moment(item.reportDate).format('YYYY');
          } else if (this.filterParam.startDate) {
            item.reportDate = moment(this.filterParam.startDate).format('YYYY');
          }
        }
        // For daily and custom reports, keep the original reportDate
      }
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
    // fData structure: [regionFilter, clusterFilter, siteIdFilter, siteType, reqSiteIdObj]
    let startDate = "";
    let endDate = "";
    let regions: any = ["All"];
    let zones: any = ["All"];
    let clusters: any = ["All"];
    let siteId: any = ["All"];
    let deviceType: any = ["All"];
    let siteType: any = ["All"];
    let siteStatus: any = null;
    let customer: any = ["All"];
    let engineer: any = ["All"];
    let rangeDate: any = null;

    if (fData && fData.length) {
      // fData[0] = Region filter
      if (fData[0] && fData[0].popupTo && fData[0].popupTo.data && fData[0].popupTo.data.length) {
        regions = fData[0].popupTo.data.map((item) => item.id);
      }

      // fData[1] = Cluster filter
      if (fData[1] && fData[1].popupTo && fData[1].popupTo.data && fData[1].popupTo.data.length) {
        clusters = fData[1].popupTo.data.map((item) => item.id);
      }

      // fData[2] = Site Id filter
      if (fData[2] && fData[2].popupTo && fData[2].popupTo.data && fData[2].popupTo.data.length) {
        siteId = fData[2].popupTo.data.map((item) => item.id);
      }

      // fData[3] = siteType checkboxes
      if (fData[3] && fData[3].length) {
        siteType = fData[3].filter((item) => item.isChecked && item.text).map((item) => item.text);
      }

      // fData[4] = reqSiteIdObj (date range / reportMonth / reportYear)
      if (fData[4] && fData[4].startDate !== null && fData[4].endDate !== null) {
        startDate = fData[4].startDate.replace(/-/g, '/');
        endDate = fData[4].endDate.replace(/-/g, '/');
        rangeDate = startDate + ' - ' + endDate;
      }
    }

    this.filterParam = {
      "siteId": siteId,
      "clusters": clusters,
      "zones": zones,
      "regions": regions,
      "deviceType": deviceType,
      "siteStatus": siteStatus ? [siteStatus] : ['All'],
      "siteType": siteType.length === 0 ? ['All'] : siteType,
      "customers": customer.length === 0 ? ['All'] : customer,
      "engineer": engineer.length === 0 ? ['All'] : engineer,
      "date": rangeDate,
      "startDate": startDate,
      "endDate": endDate,
      "reportMonth": fData && fData[4] && fData[4].reportMonth ? fData[4].reportMonth : null,
      "reportYear": fData && fData[4] && fData[4].reportYear ? fData[4].reportYear : null
    };
  }


  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
    this.isOpenTabularFilter = false;
    if (evt) {
      this.setFilterParam(evt);
      this.changeUrl=true;
      this.loadData();
    } else {
      this.setDefaultFilter();
      this.changeUrl=false;

      this.loadData();
    }
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
    this.isExporting = true;
    setTimeout(() => {
      if (this.activeTab === 'reports') {
        this.exportReportsToExcel(type);
      } else {
        this.exportLifetimeToExcel(type);
      }
      this.isExporting = false;
    }, 100);
  }

  exportLifetimeToExcel(type: string): void {
    let element = document.getElementById('export-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `battery-life-cycle-count.${type}`);
  }

  exportReportsToExcel(type: string): void {
    const reportLabel = this.selectedReportType.charAt(0).toUpperCase() + this.selectedReportType.slice(1);
    const title = `${reportLabel} Battery Life Cycle Count Report`;
    
    // Format date range based on report type
    let dateRange = '';
    if (this.selectedReportType === 'daily') {
      const fromDate = this.filterParam.startDate || '';
      const toDate = this.filterParam.endDate || '';
      if (fromDate && toDate) {
        dateRange = `From ${fromDate} to ${toDate}`;
      } else {
        dateRange = 'All';
      }
    } else if (this.selectedReportType === 'monthly') {
      // Get month name from date
      const startDate = this.filterParam.startDate ? moment(this.filterParam.startDate) : moment();
      const monthName = startDate.format('MMMM YYYY');
      dateRange = `For ${monthName}`;
    } else if (this.selectedReportType === 'yearly') {
      // Get year from date
      const startDate = this.filterParam.startDate ? moment(this.filterParam.startDate) : moment();
      const year = startDate.format('YYYY');
      dateRange = `For ${year}`;
    } else if (this.selectedReportType === 'custom') {
      const fromDate = this.filterParam.startDate || '';
      const toDate = this.filterParam.endDate || '';
      if (fromDate && toDate) {
        dateRange = `From ${fromDate} to ${toDate}`;
      } else {
        dateRange = 'All';
      }
    } else {
      dateRange = 'All';
    }

    const totalCols = 8;

    const headers = [
      this.getDefaultColumnName(), 'Region', 'Cluster',
      'Site Code', 'Site Name', 'Initial Battery Life Cycle Count',
      'Final Battery Life Cycle Count', 'Total Battery Cycle Life Count'
    ];

    let dataRows = '';
    if (this.activeListing.list && this.activeListing.list.data) {
      for (const item of this.activeListing.list.data) {
        // Get appropriate value for the first column based on report type
        let firstColumnValue = '';
        if (this.selectedReportType === 'monthly') {
          // For monthly reports, show month name (e.g., "March 2026")
          if (item.reportDate) {
            firstColumnValue = moment(item.reportDate).format('MMMM YYYY');
          } else if (this.filterParam.startDate) {
            firstColumnValue = moment(this.filterParam.startDate).format('MMMM YYYY');
          }
        } else if (this.selectedReportType === 'yearly') {
          // For yearly reports, show year (e.g., "2026")
          if (item.reportDate) {
            firstColumnValue = moment(item.reportDate).format('YYYY');
          } else if (this.filterParam.startDate) {
            firstColumnValue = moment(this.filterParam.startDate).format('YYYY');
          }
        } else {
          // For daily and custom reports, show the date
          firstColumnValue = item.reportDate || '';
        }

        dataRows += `<tr>
          <td style="border:1px solid #ccc;padding:5px;">${firstColumnValue}</td>
          <td style="border:1px solid #ccc;padding:5px;">${item.region || ''}</td>
          <td style="border:1px solid #ccc;padding:5px;">${item.cluster || ''}</td>
          <td style="border:1px solid #ccc;padding:5px;">${item.siteCode || ''}</td>
          <td style="border:1px solid #ccc;padding:5px;">${item.siteName || ''}</td>
          <td style="border:1px solid #ccc;padding:5px;">${item.initialBatteryLifeCycleCount || ''}</td>
          <td style="border:1px solid #ccc;padding:5px;">${item.finalBatteryLifeCycleCount || ''}</td>
          <td style="border:1px solid #ccc;padding:5px;">${item.totalBatteryCycleLifeCount || ''}</td>
        </tr>`;
      }
    }

    // Removed green background, kept bold and centered headers
    const headerCells = headers.map(h =>
      `<th style="border:1px solid #000;padding:6px 10px;background-color:#f5f5f5;color:#000;font-weight:bold;text-align:center;">${h}</th>`
    ).join('');

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8">
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
      <x:Name>Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
      </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head><body>
      <table>
        <tr><td colspan="${totalCols}"></td></tr>
        <tr><td colspan="${totalCols}" style="text-align:center;font-size:16px;font-weight:bold;padding:10px;">${title}</td></tr>
        <tr><td colspan="${totalCols}" style="text-align:center;font-size:12px;padding:5px;">${dateRange}</td></tr>
        <tr><td colspan="${totalCols}"></td></tr>
        <tr>${headerCells}</tr>
        ${dataRows}
      </table>
      </body></html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.selectedReportType}-battery-life-cycle-report.xls`;
    a.click();
    URL.revokeObjectURL(url);
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
    value = value.toUpperCase();
    if (value) {
      this.sampleData.data = this.allData.data.filter((item) => {
        if (this.activeTab === 'reports') {
          return (
            (item.siteCode && item.siteCode.toString().toUpperCase().includes(value)) ||
            (item.siteName && item.siteName.toString().toUpperCase().includes(value)) ||
            (item.region && item.region.toString().toUpperCase().includes(value)) ||
            (item.cluster && item.cluster.toString().toUpperCase().includes(value))
          );
        } else {
          if (!!item.smSiteCode && !!item.smSiteID) {
            return (item.smSiteID.includes(value) || item.smSiteCode.includes(value));
          }
        }
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    if (this.lifetimeTableComponent) {
      this.lifetimeTableComponent.init();
    }
  }

  switchTab(tab: string) {
    if (this.activeTab === tab) return;
this.sampleData = { data: [] };
    this.activeListing = { list: { data: [] } };
    this.allData = { data: [] };
    // Don't cancel inflight requests - let them complete
    this.isLoading = false;

    this.activeTab = tab;
    this.isOpenTabularFilter = false;

    // Clear all data immediately
    

    if (this.activeTab === 'reports' && this.reportsTableComponent) {
      this.reportsTableComponent.init();
    } else if (this.activeTab === 'lifetime' && this.lifetimeTableComponent) {
      this.lifetimeTableComponent.init();
    }

    this.setDefaultFilter();
    // Only load data automatically for lifetime tab
    // Reports tab requires user to apply filters first
    if (this.activeTab === 'lifetime') {
      this.loadData();
    }
  }

  selectReportType(type: string) {
    this.selectedReportType = type;
  }

  applyReportsFilter() {
    this.isOpenTabularFilter = false;
    this.loadData();
  }

  applyReportsFilterWithData(fData: any) {
    this.isOpenTabularFilter = false;
    if (fData) {
      this.setFilterParam(fData);
    } else {
      this.setDefaultFilter();
    }
    this.loadData();
  }

  closeReportsFilter() {
    this.isOpenTabularFilter = false;
  }

  

  

 

}
