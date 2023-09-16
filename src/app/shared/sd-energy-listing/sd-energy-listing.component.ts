import { Inject, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BroadcastService } from '../../shared/broadcast.service';
import { CommonUtilService } from '../../shared/common-util.service';
import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';

import * as Chartist from 'chartist';
import 'chartist-plugin-tooltips';
import 'chartist-plugin-legend';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-sd-energy-listing',
  templateUrl: './sd-energy-listing.component.html',
  styleUrls: ['./sd-energy-listing.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SdEnergyListingComponent implements OnInit, OnDestroy {

  @Input() tabData: any;
  @Input() smSiteCode: any = null;

  public isLoading: boolean = false;
  public isListingLoading: boolean = false;
  public isChartLoading: boolean = false;
  public selTabIndex: any = 0;
  public selTabData: any = null;
  public filterElement!: FormGroup;
  public _yearPickerCtrl: FormControl = new FormControl();

  public isIntervalDDOpen: boolean = false;
  public isSeries1DDOpen: boolean = false;
  public isSeries2DDOpen: boolean = false;
  public isSeries3DDOpen: boolean = false;
  public isSeries4DDOpen: boolean = false;
  public isSeries5DDOpen: boolean = false;
  public isSeries6DDOpen: boolean = false;
  public isSeries7DDOpen: boolean = false;

  public seriesList: any = [
    {
      label: 'Solar Output Energy',
      value: 1
    },
    {
      label: 'Solar Input Energy',
      value: 2
    },
    {
      label: 'MDG Energy',
      value: 3
    },
    {
      label: 'DG Energy',
      value: 4
    },
    {
      label: 'DC Energy',
      value: 5
    },
    {
      label: 'OPCO 1 Energy',
      value: 6
    },
    {
      label: 'OPCO 2 Energy',
      value: 7
    },
    {
      label: 'OPCO 3 Energy',
      value: 8
    },
    {
      label: 'OPCO 4 Energy',
      value: 9
    },
    {
      label: 'Tele Energy',
      value: 10
    },
    {
      label: 'Community Load Energy',
      value: 11
    },
    {
      label: 'Battery Charging Energy',
      value: 12
    },
    {
      label: 'Battery Discharge Energy',
      value: 13
    },
    {
      label: 'Inverter Energy',
      value: 14
    }
  ];
  public intervalList: any = [
    {
      label: 'Daily',
      value: 1
    },
    {
      label: 'Monthly',
      value: 2
    },
    {
      label: 'Yearly',
      value: 3
    },
    // {
    //   label: 'Till Date',
    //   value: 4
    // }
  ];
  public selInterval: any = null;
  public filterSeriesList: any = [];
  public series1: any = [];
  public selSeries: any = {
    series1: null,
    series2: null,
    series3: null,
    series4: null,
    series5: null,
    series6: null,
    series7: null
  };
  public series2: any = [];
  public chosenYearDate: any = null;
  public chosenMonthYearDate: any = null;

  public startDate: any = new FormControl(moment());
  public endDate: any = new FormControl(moment());
  public listData: any = null;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        callbacks: {
          labelColor: (context) => {
            let dataSet: any = context.dataset;
            return {
              borderColor: dataSet.borderColor,
              backgroundColor: dataSet.backgroundColor,
              borderWidth: 1
            };
          }
        }
      }
    }
  };
  public lineChartLegend = true;

  public tabView: any = {
    columnHeader: [],
    listingData: [],
    footer: {
      series1: 0,
      series2: 0,
      series3: 0,
      series4: 0,
      series5: 0,
      series6: 0,
      series7: 0
    }
  };

  private _onDestroy: Subject<void> = new Subject<void>();
  private params: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.init();
    this.initForm();
  }

  ngOnDestroy(): void {

  }

  ngAfterViewInit() {
    this._subscribeToChanges(this._yearPickerCtrl);
  }

  // Function to call when the date changes.
  onChange = (date: any) => { };

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  private _subscribeToChanges(control: FormControl) {
    if (!control) {
      return;
    }

    control.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe((value) => {
      this.chosenYearDate = value;
      const valor = new Date(value);
      this.onChange(valor);
      this.onTouched();
    });
  }

  init() {
    this.selInterval = this.intervalList[0];
    this.initSerires1();
  }

  initSerires1() {
    setTimeout(() => {
      this.setSeries1();
      this.setFilterList();
    }, 500);
  }

  initForm() {
    // this.filterElement = this.formBuilder.group({
    //   startDate: [null],
    //   endDate: [null],
    //   monthYearDate: [null]
    // });


  }

  selectInterval(evt?: any, item?: any) {
    this.selInterval = item;
  }

  setSeries1() {
    for (let item of this.seriesList) {
      if (item.value === this.tabData.value) {
        item.isSelected = true;
        this.selSeries.series1 = item;
        this.series1.push(item);
        break;
      }
    }
  }

  resetFilterList() {
    this.filterSeriesList = JSON.parse(JSON.stringify(this.seriesList));
    this.selSeries = {
      series2: null,
      series3: null,
      series4: null,
      series5: null,
      series6: null,
      series7: null
    };
    this.initSerires1();
  }

  toggleInterval(evt?: any) {
    this.isIntervalDDOpen = !this.isIntervalDDOpen;
  }

  toggleSerires1(evt?: any) {
    this.isSeries1DDOpen = !this.isSeries1DDOpen;
  }

  toggleSerires2(evt?: any) {
    this.isSeries2DDOpen = !this.isSeries2DDOpen;
  }

  toggleSerires3(evt?: any) {
    this.isSeries3DDOpen = !this.isSeries3DDOpen;
  }

  toggleSerires4(evt?: any) {
    this.isSeries4DDOpen = !this.isSeries4DDOpen;
  }

  toggleSerires5(evt?: any) {
    this.isSeries5DDOpen = !this.isSeries5DDOpen;
  }

  toggleSerires6(evt?: any) {
    this.isSeries6DDOpen = !this.isSeries6DDOpen;
  }

  toggleSerires7(evt?: any) {
    this.isSeries7DDOpen = !this.isSeries7DDOpen;
  }

  updateSeriesList(selItem: any) {
    for (let item of this.seriesList) {
      if (item.value === selItem.value) {
        item.isSelected = true;
        break;
      }
    }
  }

  setFilterList() {
    this.filterSeriesList = JSON.parse(JSON.stringify(this.seriesList)).filter((item?: any) => {
      return !item.isSelected
    });
  }

  selectSeries(evt?: any, item?: any, type?: any) {
    this.selSeries['series' + type] = item;
    this.updateSeriesList(item);
    this.setFilterList();
  }

  monthYearSel(evt: any) {
    this.chosenMonthYearDate = evt;
  }

  chosenStartYearHandler(normalizedYear: Moment) {
    const ctrlValue: any = this.startDate.value;
    ctrlValue.year(normalizedYear.year());
    this.startDate.setValue(ctrlValue);
  }

  chosenEndYearHandler(normalizedYear: Moment) {
    const ctrlValue: any = this.endDate.value;
    ctrlValue.year(normalizedYear.year());
    this.endDate.setValue(ctrlValue);
  }

  chosenStartMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue: any = this.startDate.value;
    ctrlValue.month(normalizedMonth.month());
    this.startDate.setValue(ctrlValue);
    datepicker.close();
  }

  chosenEndMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue: any = this.endDate.value;
    ctrlValue.month(normalizedMonth.month());
    this.endDate.setValue(ctrlValue);
    datepicker.close();
  }

  reset(evt?: any) {
    this.startDate.setValue(moment());
    this.endDate.setValue(moment());
    this.resetFilterList();
  }

  setParam() {
    this.params = this.tabData.param;
    this.params.reportType = this.selInterval.label;
    this.params.siteId = this.smSiteCode;

    if (this.selSeries.series2) {
      this.params.series2 = this.selSeries.series2.label;
    }

    if (this.selSeries.series3) {
      this.params.series3 = this.selSeries.series3.label;
    }

    if (this.selSeries.series4) {
      this.params.series4 = this.selSeries.series4.label;
    }

    if (this.selSeries.series5) {
      this.params.series5 = this.selSeries.series5.label;
    }

    if (this.selSeries.series6) {
      this.params.series6 = this.selSeries.series6.label;
    }

    if (this.selSeries.series7) {
      this.params.series7 = this.selSeries.series7.label;
    }

    if (this.selInterval.value == 1) {
      this.params.date = this.startDate.value.format("YYYY-MM-DD");
      this.params.dateMonth = this.startDate.value.format("YYYY-MM-DD");
      this.params.dateYear = this.endDate.value.format("YYYY-MM-DD");
      this.params.startDate = this.startDate.value.format("YYYY-MM-DD");
      this.params.endDate = this.endDate.value.format("YYYY-MM-DD");
    } else if (this.selInterval.value == 2) {
      this.params.date = this.startDate.value.format("YYYY-MM-DD");
      this.params.dateMonth = this.startDate.value.format("YYYY-MM");
      this.params.dateYear = this.endDate.value.format("YYYY-MM");
      this.params.startDate = this.startDate.value.format("YYYY-MM");
      this.params.endDate = this.endDate.value.format("YYYY-MM");
    }
  }

  fetch($evt?: any) {
    this.setParam();
    this.loadListing();
    this.loadPerfReport();
  }

  loadListing() {
    if (this.isListingLoading) {
      return;
    }
    this.isListingLoading = true;
    this.httpClient.post(this.tabData.apiUrl, this.params).subscribe((res: any) => {
      this.isListingLoading = false;
      this.manipulateTabularData(res.data);
    }, (err) => {
      this.isListingLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading no load outage report!'
      })
    });
  }

  manipulateTabularData(data) {
    if (data && Object.keys(data).length) {
      let kwhMap: any = this.tabData.kwhMap;
      let obj: any = {
        daily: data[kwhMap.daily],
        weekly: data[kwhMap.weekly],
        monthly: data[kwhMap.monthly],
        yearly: data[kwhMap.yearly],
        lifetime: data[kwhMap.lifetime],
      };
      this.listData = obj;
    }
  }

  loadPerfReport() {
    if (this.isChartLoading) {
      return;
    }
    this.isChartLoading = true;
    this.httpClient.post(ApiConstant.getSitePerfReport, this.params).subscribe((res: any) => {
      this.isChartLoading = false;
      res.data.datasets = res.data.dataSets;
      this.lineChartData = res.data;
      this.loadTabular(res);
      // this.prepareChart(res.data);
    }, (err) => {
      this.isChartLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading performance dashboard report!'
      })
    });
  }

  loadTabular(res) {
    let columns: any = [];
    let listingData: any = [];
    for (let item of res.data.dataSets) {
      columns.push({
        label: item.label,
        colField: item.label.toLowerCase().replace(/\s/g, "_"),
        footerVal: 0,
        data: item.data
      });
    }

    for (let j = 0; j < res.data.labels.length; j++) {
      let rowItem = res.data.labels[j];
      let objItem = {};
      for (let i = 0; i < columns.length; i++) {
        let colItem = columns[i];
        objItem["series" + (i + 1)] = colItem.data[j].toFixed(2);
        this.tabView.footer["series" + (i + 1)] += colItem.data[j];
      }
      listingData.push({
        label: rowItem,
        ...objItem
      })
    }
    this.tabView.columnHeader = columns;
    this.tabView.listingData = listingData;
  }

  tabChanged(evt) {
    this.selTabIndex = evt.index;
  }

  test() {

    let customerList = [
      {
        id: 1,
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        isVerify: true,
        bookFor: [],
        isActive: false,
        isDelete: false,
        createdAt: null,
        createdBy: null,
        updatedAt: null,
        updatedBy: null
      }
    ];

    let tableList = [
      {
        id: 1,
        number: 1,
        capacity: 2,
        nickName: '',
        isActive: true,
        isDelete: true,
        createdAt: null,
        createdBy: null,
        updatedAt: null,
        updatedBy: null
      }
    ];

    // Select Type: Breakfast		Selected Day: Saturday or [Monday to Friday]		Open or Close

    // Start Time:	06:00 AM		End Time: 10:00 AM

    //   1.	Available Start Time:	06:00 AM		Available End Time:		07:00 AM
    //     Available Table: Table Number, Nick or Pet Name and Capacity Display (Multiple Selection)

    //   2.	Available Start Time:	07:00 AM		Available End Time:		08:00 AM
    //     Available Table: Table Number, Nick or Pet Name and Capacity Display (Multiple Selection)

    //   3.	Available Start Time:	08:00 AM		Available End Time:		09:00 AM
    //     Available Table: Table Number, Nick or Pet Name and Capacity Display (Multiple Selection)

    //   2.	Available Start Time:	09:00 AM		Available End Time:		10:00 AM
    //     Available Table: Table Number, Nick or Pet Name and Capacity Display (Multiple Selection)


    // Repeat: Every Selected Day			Till (End Date):	31-Aug-2022

    let timeTableList = [
      {
        reserveDate: '25-June-2022',
        reserveDay: 'Saturday',
        selectedType: 'Breakfast',
        isOpen: true,
        startTime: '06:00 AM',
        endTime: '10:00 AM',
        availTime: [
          {
            availStartTime: '06:00 AM',
            availEndTime: '07:00 AM',
            isFreeze: false,
            isBooked: false,
            availTableList: [
              {
                tableNo: 1,
                nickName: '',
                capacity: 2,
                isFreeze: false,
                isBook: false,
                customer: [
                  {
                    firstName: '',
                    lastName: '',
                    mobileNumber: '',
                    specialInstruction: '',
                    email: '',
                    isAccepted: false,
                    isRejected: false,
                    isAbsent: false,
                    isSMS: false,
                    isNotifyMe: false,
                    queueNo: null,
                    requestedTime: null
                  },
                  {
                    firstName: '',
                    lastName: '',
                    mobileNumber: '',
                    specialInstruction: '',
                    email: '',
                    isAccepted: false,
                    isRejected: false,
                    isAbsent: false,
                    isSMS: false,
                    isNotifyMe: true,
                    queueNo: 1,
                    requestedTime: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }

}
