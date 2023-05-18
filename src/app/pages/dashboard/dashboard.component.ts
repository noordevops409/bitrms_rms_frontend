import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonUtilService } from '../../shared/common-util.service';
import { BroadcastService } from '../../shared/broadcast.service';

import * as XLSX from 'xlsx';

import { TOWER_STATUS_COLUMN_HEADER } from './tower-status-column.enum';
// import { ALARM_STATUS_COLUMN_HEADER } from './alarm-status-column.enum';

import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';

import * as Chartist from 'chartist';

import 'chartist-plugin-tooltips';
import 'chartist-plugin-legend';
import 'chartist-plugin-pointlabels';
// import 'chartist-plugin-barlabels';

import { TableListingComponent } from '../../shared/table-listing/table-listing.component';
import { ImgPreviewComponent } from './img-preview/img-preview.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild(TableListingComponent, { static: true }) public tableListingComponent!: TableListingComponent;

  public isLoading: boolean = false;
  public isListServerError: boolean = false;

  public parentHeight: any = null;
  public selectedRow: any = null;
  public multipleSelRow: any = null;
  public list = [];
  public list1 = [];
  public appType: Number = AppConstant.LATEST_DATA1_APP_TYPE;
  public appType1: Number = AppConstant.ALARM_STATUS_APP_TYPE;

  public activeListing: any = {};
  public data: any;
  public listingTemplate: any = {};

  public latestReportStatus: any = null;
  public ddExport: any = "-1";

  isReqToOpenFilter: boolean = false;
  isOpenTabularFilter: boolean = false;
  isExpanded: boolean = false;
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
  public isFilterDataLoaded1: boolean = false;
  public totalAlarmCatCount: any = 0;

  private allData: any = {};
  private sampleData: any = {};
  private sampleData1: any = {};
  private currentPageNo: number = 0;
  private pageSize: number = 10;
  private recordStartFrom: number = 0;
  private isMultipleRowSelected: boolean = false;

  private filterParam: any = {
    "siteId": [],
    "clusters": [],
    "zones": [],
    "regions": [],
    "deviceType": [],
    "siteType": [],
    "siteStatus": [],
    "customers": [],
    "date": null
  };
  private hasFilterData: boolean = false;
  private type: any = null;
  private forImgPreview!: Subscription;

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
    this.listen();
    this.init();
    this.loadBarChart();
  }

  ngOnDestroy() {
    this.forImgPreview.unsubscribe();
  }

  listen() {
    this.forImgPreview = this.broadcast.on<string>('OPEN_GRAPHIC_FOR_SITE').subscribe((data: any) => {
      this.ngZone.run(() => {
        this.showImg(data);
      });
    });
  }

  init() {
    this.type = (this.route.snapshot.queryParams as any).type;
    this.loadTowerLatestData();
    this.loadLatestReportStatus();
  }

  refreshLatestStatusData(evt?: any) {
    this.loadLatestReportStatus();
  }

  loadLatestReportStatus() {
    this.httpClient.post(ApiConstant.getLatestReportStatus, {
      "groupByDefault": true,
      "groupByCustomer": false,
      "groupBySiteType": false,
      "groupByDeviceType": false,
      "groupByRegion": false,
      "groupByPowerSource": false,
      "powerSource": ""
    }).subscribe((res: any) => {
      this.setLatestReportStatus(res);
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading latest report data'
      })
    })
  }

  setLatestReportStatus(res: any) {
    let obj: any = {
      percentage: null,
      onlineSite: 0,
      totalSite: 0,
      offlineSite: 0
    };
    for (let item of res.data) {
      obj.onlineSite += item.onlineSite;
      obj.offlineSite += item.offlineSite;
      obj.totalSite += item.totalSite;
    }
    obj.percentage = ((obj.onlineSite * 100) / obj.totalSite).toFixed(2) + '%';
    this.latestReportStatus = obj;
    this.loadLatestReportByDevice();
    this.loadMultiLinesLabelChartByDevice();
    this.loadStackBarChartByCustomer();
    this.loadStackBarChartBySiteType();
    this.loadStackBarChartByRegion();
    this.loadChartByPower();
  }

  loadLatestReportByDevice() {
    this.httpClient.post(ApiConstant.getLatestReportStatus, {
      "groupByDefault": false,
      "groupByCustomer": false,
      "groupBySiteType": false,
      "groupByDeviceType": true,
      "groupByRegion": false,
      "groupByPowerSource": false,
      "powerSource": ""
    }).subscribe((res: any) => {
      if (res && res.data && res.data.length) {
        let chartData: any = res.data;
        let totalSite: any = 0;
        let deviceTypeList: any = chartData.map((item: any) => {
          return item.deviceType ? item.deviceType : 'Delta';
        });
        let onlineList: any = chartData.map((item: any) => {
          return item.onlineSite === 0 ? null : item.onlineSite;
        });

        let offlineList: any = chartData.map((item: any) => {
          return item.offlineSite === 0 ? null : item.offlineSite;
        });
        chartData.map((item: any) => {
          totalSite += item.totalSite;
        });

        var data = {
          labels: [...deviceTypeList],
          series: [...offlineList]
        };

        let findItem = (online: any) => {
          return chartData.filter((item: any) => item.online === online)[0];
        };

        var options = {
          labelInterpolationFnc: (value: any) => {
            value = parseInt(value, 10);
            let cData = findItem(value);
            return Math.round(value / cData.total * 100) + '%';
          },
          showLabel: true,
          chartPadding: 30,
          labelOffset: 50,
          labelDirection: 'explode',
          plugins: [
            Chartist.plugins.tooltip({
              transformTooltipTextFnc: (tooltip: any) => {
                // console.log(tooltip);
                tooltip = parseInt(tooltip, 10);
                let cData = findItem(tooltip);
                return Math.round(tooltip / cData.total * 100) + '%';
              },
              class: 'class1 class2',
              appendToBody: true
            }),
            Chartist.plugins.legend()
          ]
        };

        var responsiveOptions = [
          ['screen and (min-width: 640px)', {
            chartPadding: 30,
            labelOffset: 100,
            labelDirection: 'explode',
            labelInterpolationFnc: (value: any) => {
              return value;
            }
          }],
          ['screen and (min-width: 1024px)', {
            labelOffset: 80,
            chartPadding: 20
          }]
        ];

        let chart = new Chartist.Pie('#websiteViewsChart2', data, options, responsiveOptions);
        chart.on('draw', (data: any) => {
          if (data.type === 'slice') {
            data.element._node.onclick = (event: any) => this.click(data);
          }
        });
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading latest report data'
      })
    })
  }

  loadAllData(evt, type) {
    evt.preventDefault();
    this.router.navigate(['pages', 'dashboard', 'type', '' + type]);
  }

  click(item: any) {
    // console.log(item);
    var elem = document.querySelectorAll('.chartist-tooltip.tooltip-show');
    elem.forEach(item => item.remove());
    if (item && item.index === 0) {
      this.router.navigate(['pages', 'dashboard', 'type', '2']);
    } else if (item.index === 1) {
      this.router.navigate(['pages', 'dashboard', 'type', '1']);
    }
  }

  searchGlobally(event) {
    let { value } = event.target;
    value = value.toUpperCase();
    if (value) {
      this.sampleData.data = this.allData.data.filter((item) => {
        if (!!item.smSiteCode && !!item.siteName) {
          return (item.siteName.includes(value) || item.smSiteCode.includes(value))
        }
      });
    } else {
      this.sampleData.data = this.allData.data;
    }
    this.activeListing.list = this.sampleData;
    this.tableListingComponent.init();
  }

  loadTowerListing($evt?: any, type?: any) {
    (window as any).localStorage.removeItem('type');
    (window as any).localStorage.setItem('type', '' + type);
  }

  loadMultiLinesLabelChartByDevice() {
    this.httpClient.post(ApiConstant.getLatestReportStatus, {
      "groupByDefault": false,
      "groupByCustomer": false,
      "groupBySiteType": false,
      "groupByDeviceType": true,
      "groupByRegion": false,
      "groupByPowerSource": false,
      "powerSource": ""
    }).subscribe((res: any) => {
      if (res && res.data && res.data.length) {
        let chartData: any = res.data;

        let deviceTypeList: any = chartData.map((item: any) => {
          return item.deviceType ? item.deviceType : 'Delta';
        });

        let totalList: any = chartData.map((item: any) => {
          return item.total;
        });

        let onlineList: any = chartData.map((item: any) => {
          return item.onlineList === 0 ? null : item.onlineList;
        });

        let offlineList: any = chartData.map((item: any) => {
          return item.offlineSite === 0 ? null : item.offlineSite;
        });

        new Chartist.Bar('#websiteViewsChart3', {
          labels: [...deviceTypeList],
          series: [
            // { name: "Total", data: [...totalList] },
            { name: "Online", data: [...onlineList] },
            { name: "Offline", data: [...offlineList] }
          ]
        }, {
          seriesBarDistance: 10,
          axisX: {
            offset: 60,
            labelInterpolationFnc: (value: any) => {
              return value;
            }
          },
          axisY: {
            offset: 80,
            labelInterpolationFnc: (value: any) => {
              return value;
            },
            scaleMinSpace: 15
          },
          plugins: [
            Chartist.plugins.legend(),
            Chartist.plugins.tooltip({
              transformTooltipTextFnc: (tooltip: any) => {
                return tooltip;
              },
              class: 'class1 class2',
              appendToBody: true
            }),
            Chartist.plugins.legend()
          ]
        });
      }
    });
  }

  loadStackBarChartByCustomer() {
    this.httpClient.post(ApiConstant.getLatestReportStatus, {
      "groupByDefault": false,
      "groupByCustomer": true,
      "groupBySiteType": false,
      "groupByDeviceType": false,
      "groupByRegion": false,
      "groupByPowerSource": false,
      "powerSource": ""
    }).subscribe((res: any) => {
      if (res && res.data && res.data.length) {
        let chartData: any = res.data;

        let customerTypeList: any = chartData.map((item: any) => {
          return item.customerName;
        });

        let totalList: any = chartData.map((item: any) => {
          return item.totalSite === 0 ? null : item.totalSite;
        });

        let onlineList: any = chartData.map((item: any) => {
          return item.onlineSite === 0 ? null : item.onlineSite;
        });

        let offlineList: any = chartData.map((item: any) => {
          return item.offlineSite === 0 ? null : item.offlineSite;
        });

        new Chartist.Bar('#websiteViewsChart4', {
          labels: [...customerTypeList],
          series: [
            // { name: "Total", data: [...totalList] },
            { name: "Online", data: [...onlineList] },
            { name: "Offline", data: [...offlineList] }
          ]
        }, {
          seriesBarDistance: 10,
          stackBars: true,
          axisX: {
            offset: 60,
            labelInterpolationFnc: (value: any) => {
              return value;
            }
          },
          axisY: {
            offset: 80,
            labelInterpolationFnc: (value: any) => {
              return value;
            },
            scaleMinSpace: 15
          },
          plugins: [
            Chartist.plugins.legend(),
            Chartist.plugins.ctPointLabels({
              textAnchor: 'middle'
            }),
            Chartist.plugins.tooltip({
              transformTooltipTextFnc: (tooltip: any) => {
                return tooltip;
              },
              class: 'class1 class2',
              appendToBody: true
            }),
            Chartist.plugins.legend()
          ]
        });
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading latest report data by customer'
      })
    });
  }

  loadStackBarChartBySiteType() {
    this.httpClient.post(ApiConstant.getLatestReportStatus, {
      "groupByDefault": false,
      "groupByCustomer": false,
      "groupBySiteType": true,
      "groupByDeviceType": false,
      "groupByRegion": false,
      "groupByPowerSource": false,
      "powerSource": ""
    }).subscribe((res: any) => {
      if (res && res.data && res.data.length) {
        let chartData: any = res.data;

        let siteTypeList: any = chartData.map((item: any) => {
          return item.siteType;
        });

        let totalList: any = chartData.map((item: any) => {
          return item.totalSite === 0 ? null : item.totalSite;
        });

        let offlineList: any = chartData.map((item: any) => {
          return item.offlineSite === 0 ? null : item.offlineSite;
        });

        let onlineList: any = chartData.map((item: any) => {
          return item.onlineSite === 0 ? null : item.onlineSite;
        });

        new Chartist.Bar('#websiteViewsChart5', {
          labels: [...siteTypeList],
          series: [
            // { name: "Total", data: [...totalList] },
            { name: "Offline", data: [...offlineList] },
            { name: "Online", data: [...onlineList] }
          ]
        }, {
          seriesBarDistance: 10,
          stackBars: true,
          axisX: {
            offset: 60,
            labelInterpolationFnc: (value: any) => {
              return value;
            }
          },
          axisY: {
            offset: 80,
            labelInterpolationFnc: (value: any) => {
              return value;
            },
            scaleMinSpace: 15
          },
          plugins: [
            Chartist.plugins.legend(),
            Chartist.plugins.ctPointLabels({
              textAnchor: 'middle'
            }),
            Chartist.plugins.tooltip({
              transformTooltipTextFnc: (tooltip: any) => {
                return tooltip;
              },
              class: 'class1 class2',
              appendToBody: true
            }),
            Chartist.plugins.legend()
          ]
        });
      }
    });
  }

  loadStackBarChartByRegion() {
    this.httpClient.post(ApiConstant.getLatestReportStatus, {
      "groupByDefault": false,
      "groupByCustomer": false,
      "groupBySiteType": false,
      "groupByDeviceType": false,
      "groupByRegion": true,
      "groupByPowerSource": false,
      "powerSource": ""
    }).subscribe((res: any) => {
      if (res && res.data && res.data.length) {
        let chartData: any = res.data;

        let regionList: any = chartData.map((item: any) => {
          return item.region ? item.region : "Dummy";
        });

        let totalList: any = chartData.map((item: any) => {
          return item.totalSite === 0 ? null : item.totalSite;
        });

        let offlineList: any = chartData.map((item: any) => {
          return item.offlineSite === 0 ? null : item.offlineSite;
        });

        let onlineList: any = chartData.map((item: any) => {
          return item.onlineSite === 0 ? null : item.onlineSite;
        });

        new Chartist.Bar('#websiteViewsChart6', {
          labels: [...regionList],
          series: [
            // { name: "Total", data: [...totalList] },
            { name: "Offline Site", data: [...offlineList] },
            { name: "Online Site", data: [...onlineList] }
          ]
        }, {
          seriesBarDistance: 10,
          stackBars: true,
          axisX: {
            offset: 60,
            labelInterpolationFnc: (value: any) => {
              return value;
            }
          },
          axisY: {
            offset: 80,
            labelInterpolationFnc: (value: any) => {
              return value;
            },
            scaleMinSpace: 15
          },
          plugins: [
            Chartist.plugins.legend(),
            Chartist.plugins.ctPointLabels({
              textAnchor: 'middle'
            }),
            Chartist.plugins.tooltip({
              transformTooltipTextFnc: (tooltip: any) => {
                return tooltip;
              },
              class: 'class1 class2',
              appendToBody: true
            }),
            Chartist.plugins.legend()
          ]
        });
      }
    });
  }

  loadTowerLatestData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    const url = ApiConstant.getLatestData;
    this.httpClient.get(url).subscribe((data: any) => {
      this.isLoading = false;
      this.manipulate(data.data);
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Tower Latest Details!'
      })
    });
  }

  loadFilterTowerStatusData() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    let url = ApiConstant.getLatestData1;
    this.httpClient.post(url, this.filterParam).subscribe((data: any) => {
      this.isLoading = false;
      this.manipulate(data.data);
      setTimeout(() => {
        this.tableListingComponent.init();
      });
    }, (err) => {
      this.isLoading = false;
      this.isListServerError = true;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Tower Latest Details!'
      })
    });
  }

  manipulate(data: any) {
    this.setResponse(data);
    this.setColumnHeader(data);
    this.setRowData(data);
    this.activeListing.list = this.sampleData;
  }

  setResponse(resData: any) {
    this.sampleData.currentPageNo = this.currentPageNo + 1;
    this.sampleData.listingType = AppConstant.LATEST_DATA1_LISTING_TYPE;
    this.sampleData.recordBatchSize = 50 || resData.length;
    this.sampleData.recordStartFrom = this.recordStartFrom;
    this.sampleData.sortField = 'smSiteCode';
    this.sampleData.sortFieldType = 'text';
    this.sampleData.sortOrder = 'desc';
    this.sampleData.totalDocs = resData.totalElements || resData.length;
  }

  setColumnHeader(resData: any) {
    this.sampleData.columnHeader = [];
    const colData = resData || [];
    if (colData.length) {
      const rowData = colData[0];
      for (let key in rowData) {
        if (TOWER_STATUS_COLUMN_HEADER[key]) {
          this.sampleData.columnHeader.push(TOWER_STATUS_COLUMN_HEADER[key]);
        }
      }
      this.sampleData.columnHeader.push(TOWER_STATUS_COLUMN_HEADER['alarmCategory']);
      this.sampleData.columnHeader.push(TOWER_STATUS_COLUMN_HEADER['hourlyReport']);
      this.sampleData.columnHeader.push(TOWER_STATUS_COLUMN_HEADER['imgPath']);
    }
  }

  setRowData(resData: any) {
    const data = resData || [];
    if (data.length) {
      for (let item of data) {
        item.alarmCategory = 'Alarm Category';
        item.hourlyReport = 'Hourly Report';
        item.imgPath = 'View Image';
      }
      this.sampleData.data = data;
      this.allData.data = data;
    } else {
      this.sampleData.data = [];
      this.allData.data = data;
    }
  }

  loadChartByPower() {
    this.httpClient.post(ApiConstant.getLatestReportStatus, {
      "groupByDefault": false,
      "groupByCustomer": false,
      "groupBySiteType": false,
      "groupByDeviceType": false,
      "groupByRegion": false,
      "groupByPowerSource": true,
      "powerSource": ""
    }).subscribe((res: any) => {
      this.maipulatePieChartData(res);
    });
  }

  maipulatePieChartData(res: any) {
    let label: any = [];
    let series: any = [];
    let valueList: any = [];
    for (let item of res.data) {
      label.push(item.powerSource);
      valueList.push(item.offlineSite);
      if (item.powerSource === 'AC_Power') {
        series.push({
          label: item.powerSource,
          value: item.offlineSite,
          className: "ac-power"
        });
      } else if (item.powerSource === 'DG') {
        series.push({
          label: item.powerSource,
          value: item.offlineSite,
          className: "dc-power"
        });
      } else if (item.powerSource === 'Battery') {
        series.push({
          label: item.powerSource,
          value: item.offlineSite,
          className: "battery-solar"
        });
      } else if (item.powerSource === 'Unknown') {
        series.push({
          label: item.powerSource,
          value: item.offlineSite,
          className: "unknown"
        });
      } else if (item.powerSource === '.') {
        series.push({
          label: item.powerSource,
          value: item.offlineSite,
          className: "extra-dot"
        });
      }
    }
    this.initPieChart(label, series, valueList);
  }



  initPieChart(label: any, series: any, valueList: any) {
    let sum = (a: any, b: any) => { return a + b };
    let data: any = {
      labels: label,
      series: series
    };

    let getSeriesData = (req) => {
      return series.filter((item) => {
        return item.label === req;
      })[0];
    };

    let arrayList = valueList;
    new Chartist.Pie('#websiteViewsChart', data, {
      labelInterpolationFnc: (value: any) => {
        let sData = getSeriesData(value);
        return Math.round(sData.value / arrayList.reduce(sum) * 100) + '%';
      },
      // showLabel: false,
      chartPadding: 30,
      labelOffset: 50,
      labelDirection: 'explode',
      plugins: [
        // Chartist.plugins.ctPointLabels({
        //   textAnchor: 'middle'
        // }),
        // Chartist.plugins.tooltip({
        //   transformTooltipTextFnc: (tooltip: any) => {
        //     // console.log(tooltip);
        //     return Math.round(tooltip / arrayList.reduce(sum) * 100) + '%';
        //   },
        //   class: 'class1 class2',
        //   appendToBody: true
        // }),
        Chartist.plugins.legend()
      ],
    });
  }

  loadBarChart() {
    this.totalAlarmCatCount = 0;
    const apiUrl = ApiConstant.getAlarmCatSummary;
    this.httpClient.get(apiUrl).subscribe((res: any) => {
      if (res && res.length) {
        let labels:  any = [];
        let dataset: any = [];
        let total = 0;
        for (let item of res) {
          labels.push(item[0]);
          dataset.push(item[1]);
          total += item[1];
        }
        this.totalAlarmCatCount = total;
        new Chartist.Bar('#websiteViewsChart1', {
          labels: labels,
          series: [
            dataset
          ]
        });
      }
      
    });
  }

  openFilter(evt?: any) {
    this.isReqToOpenFilter = !this.isReqToOpenFilter;
  }

  onFilterChange(evt?: any) {

  }

  openTabular(evt?: any) {
    this.isExpanded = !this.isExpanded;
  }

  openTabularFilter(evt?: any) {
    this.isOpenTabularFilter = !this.isOpenTabularFilter;
  }

  setFilterParam(fData) {

    let regions: any = [];
    let zones: any = [];
    let clusters: any = [];
    let siteId: any = [];
    let deviceType: any = [];
    let siteType: any = [];
    let siteStatus: any = null;
    let customer: any = [];
    let rangeDate: any = "";
    if (fData && fData.length) {
      regions = fData[0].popupTo.data.map((item) => {
        return item.id;
      });
      zones = fData[1].popupTo.data.map((item) => {
        return item.id;
      });

      clusters = fData[2].popupTo.data.map((item) => {
        return item.id;
      });

      siteId = fData[3].popupTo.data.map((item) => {
        return item.id;
      });

      deviceType = fData[4].popupTo.data.map((item) => {
        return item.id;
      });

      siteType = fData[5].filter((item) => {
        return item.isChecked && item.text;
      }).map((item) => {
        return item.text;
      });

      if (fData[6] && fData[6].startDate && fData[6].endDate) {
        rangeDate = fData[6].startDate.replace(/-/g, '/') + ' - ' + fData[6].endDate.replace(/-/g, '/');
      }

      siteStatus = parseInt(fData[7], 10);

      customer = fData[8].filter((item) => {
        return item.isChecked && item.text;
      }).map((item) => {
        return item.text;
      });
    }
    this.filterParam = {
      "siteId": siteId,
      "clusters": clusters,
      "zones": zones,
      "regions": regions,
      "deviceType": deviceType,
      "siteType": siteType,
      "siteStatus": siteStatus,
      "customers": customer,
      "date": rangeDate
    };
  }

  applyFilter(evt?: any) {
    this.isReqToOpenFilter = false;
    if (evt) {
      this.setFilterParam(evt);
      this.loadFilterTowerStatusData();
    } else {
      this.loadTowerLatestData();
    }
  }

  updateListParam(data: any) {
    this.currentPageNo = data.currentPageNo ? (data.currentPageNo - 1) : this.currentPageNo;
    this.pageSize = data.pageSize || this.pageSize;
    this.recordStartFrom = data.recordStartFrom || this.recordStartFrom;

    if (data && data.popupTo) {
      this.applyFilter(data);
    } else {
      this.loadTowerLatestData();
    }
  }

  loadListing(data: any) {
    this.updateListParam(data);
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

  exportTableToExcel(type: string): void {
    /* pass here the table id */
    let element = document.getElementById('export-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `tower-status-data.${type}`);

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
    let selVal = this.ddExport;
    if (selVal === "1") {
      this.exportExcel(evt);
    } else if (selVal === "2") {
      this.exportCSV(evt);
    }
  }

  showImg(data) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ImgPreviewComponent, {
      width: '1000px',
      height: 'auto',
      data: data
    });
    dialogRef.afterClosed().subscribe(data => {
      
    });
  }

}
