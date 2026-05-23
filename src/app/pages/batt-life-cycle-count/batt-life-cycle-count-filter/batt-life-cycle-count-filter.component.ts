import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-batt-life-cycle-count-filter',
  templateUrl: './batt-life-cycle-count-filter.component.html',
  styleUrls: ['./batt-life-cycle-count-filter.component.scss']
})
export class BattLifeCycleCountFilterComponent implements OnInit {

  @Input() filterType: number = 1;

  @Input() isReqToOpenFilter: boolean = false;
  @Input() isOpenTabularFilter: boolean = false;
  @Input() defaultFilterList: any;
  @Input() selectedReportType: string = 'daily';
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() onReportTypeChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() isReqToOpenFilterChange = new EventEmitter();
  @Output() isOpenTabularFilterChange = new EventEmitter();

  public months: any[] = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 }
  ];
  public years: number[] = [];
  public selectedMonth: number = moment().month();
  public selectedYear: number = moment().year();
  public maxDate: Date = moment().toDate();

  public siteType: any = [
    {
      isChecked: false,
      text: 'All'
    },
    {
      isChecked: false,
      text: 'TEE'
    },
    {
      isChecked: false,
      text: 'Hybrid'
    },
    {
      isChecked: false,
      text: 'Null'
    }
  ];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private reqSiteIdObj: any = {
    startDate: moment().add(-2, 'days').format('YYYY-MM-DD'),
   endDate: moment().add(-1, 'days').format('YYYY-MM-DD')
  };

  constructor() { }

  ngOnInit(): void {
    console.log('BattLifeCycleCountFilterComponent - defaultFilterList:', this.defaultFilterList);
    this.setSiteType();
    this.setDateRange();
    this.initYears();
  }

  closeFilterDropdown(event: any) {
    // Handle dropdown close event
  }

  initYears() {
    const currentYear = moment().year();
    this.years = [];
    for (let y = currentYear; y >= currentYear - 10; y--) {
      this.years.push(y);
    }
  }

  setSiteType() {
    if (this.defaultFilterList && this.defaultFilterList.length && this.defaultFilterList[5]) {
      this.siteType = this.defaultFilterList[5];
    }
  }

  setDateRange() {
    let t1: any = this.defaultFilterList;
    if (t1 && t1.length && t1[6]) {
      let t2: any = t1[6];
      if (t2.startDate && t2.endDate) {
        this.reqSiteIdObj.startDate = moment(t2.startDate);
        this.reqSiteIdObj.endDate = moment(t2.endDate);

        this.range.controls['start'].setValue(this.reqSiteIdObj.startDate);
        this.range.controls['end'].setValue(this.reqSiteIdObj.endDate);
      }
    } else {
      // For daily reports, set both dates to yesterday to match main component
      const yesterday = moment().subtract(1, 'days');
      this.range.controls['start'].setValue(yesterday.toDate());
      this.range.controls['end'].setValue(yesterday.toDate());
    }
  }

  dateRangeChange(type: any, evt: any) {
    if (this.range.controls['start'].value && this.range.controls['end'].value) {
      let startDate = moment(this.range.controls['start'].value).format('YYYY-MM-DD');
      let endDate = moment(this.range.controls['end'].value).format('YYYY-MM-DD');
      this.reqSiteIdObj.startDate = startDate;
      this.reqSiteIdObj.endDate = endDate;

      // If Report Type is 'daily' but user selected a date range (different dates), switch to 'custom'
      if (this.filterType === 2 && this.selectedReportType === 'daily') {
        if (startDate !== endDate) {
          this.selectedReportType = 'custom';
          this.onReportTypeChange.emit('custom');
          this.reqSiteIdObj.reportMonth = null;
          this.reqSiteIdObj.reportYear = null;
        }
      }
    }
  }

  reset(evt?: any) {
    var closeButton = document.querySelector('.mat-icon.notranslate.grp-btn.fa.fa-close.fa-times.material-icons.mat-ligature-font.mat-icon-no-color.ng-star-inserted') as HTMLButtonElement;    if (closeButton) {
      closeButton.click();
    } else {
    //  console.log('Button not found');
    }
    // Reset to yesterday's date for consistency
    const yesterday = moment().subtract(1, 'days');
    this.range.controls['start'].setValue(yesterday.toDate());
    this.range.controls['end'].setValue(yesterday.toDate());

    // Also update reqSiteIdObj to maintain consistency
    this.reqSiteIdObj.startDate = yesterday.format('YYYY-MM-DD');
    this.reqSiteIdObj.endDate = yesterday.format('YYYY-MM-DD');
    this.reqSiteIdObj.reportMonth = null;
    this.reqSiteIdObj.reportYear = null;

    if (this.filterType === 1) {
      this.isReqToOpenFilter = false;
      this.isReqToOpenFilterChange.emit(this.isReqToOpenFilter);
    } else if (this.filterType === 2) {
      this.isOpenTabularFilter = false;
      this.isOpenTabularFilterChange.emit(this.isOpenTabularFilter);
    }
    this.siteType.forEach(item => {
      item.isChecked = item.text === '';
    });
    // Clear all dropdown selections
    if (this.defaultFilterList) {
      this.defaultFilterList.forEach(f => {
        if (f && f.popupTo) {
          f.popupTo.data = [];
        }
      });
    }
    this.onFilter.emit();
  }

  applyFilter(evt?: any) {
    setTimeout(() => {
      if (this.filterType === 1) {
        this.isReqToOpenFilter = false;
        this.isReqToOpenFilterChange.emit(this.isReqToOpenFilter);
      } else if (this.filterType === 2) {
        this.isOpenTabularFilter = false;
        this.isOpenTabularFilterChange.emit(this.isOpenTabularFilter);
      }
      
      // Find all dropdown filters by fieldName
      const regionFilter = this.defaultFilterList.find(f => f.fieldName === 'regions');
      const clusterFilter = this.defaultFilterList.find(f => f.fieldName === 'clusters');
      const siteIdFilter = this.defaultFilterList.find(f => f.fieldName === 'siteId');
      
      // Emit: [regionFilter, clusterFilter, siteIdFilter, siteType, reqSiteIdObj]
      const filterData = [regionFilter, clusterFilter, siteIdFilter, this.siteType, this.reqSiteIdObj];
      this.onFilter.emit(filterData);
    }, 500);
  }

  selectReportType(type: string) {
    this.selectedReportType = type;
    this.onReportTypeChange.emit(type);
    this.adjustDateRangeForReportType(type);
  }

  onReportTypeDropdownChange() {
    this.onReportTypeChange.emit(this.selectedReportType);
    this.adjustDateRangeForReportType(this.selectedReportType);
  }

  adjustDateRangeForReportType(type: string) {
    if (type === 'daily') {
      // For daily reports, set both start and end to the same day (yesterday)
      const singleDate = moment().add(-1, 'days');
      this.range.controls['start'].setValue(singleDate.toDate());
      this.range.controls['end'].setValue(singleDate.toDate());
      this.reqSiteIdObj.startDate = singleDate.format('YYYY-MM-DD');
      this.reqSiteIdObj.endDate = singleDate.format('YYYY-MM-DD');
      this.reqSiteIdObj.reportMonth = null;
      this.reqSiteIdObj.reportYear = null;
    } else if (type === 'monthly') {
      this.onMonthYearChange();
    } else if (type === 'yearly') {
      this.onYearChange();
    } else if (type === 'custom') {
      this.reqSiteIdObj.reportMonth = null;
      this.reqSiteIdObj.reportYear = null;
      // For custom, don't auto-set dates - let user choose their own range
      // Keep existing dates or set a reasonable default
      if (!this.range.controls['start'].value || !this.range.controls['end'].value) {
        const endDate = moment().add(-1, 'days');
        const startDate = moment(endDate).subtract(7, 'days'); // Default to last 7 days
        this.range.controls['start'].setValue(startDate.toDate());
        this.range.controls['end'].setValue(endDate.toDate());
        this.reqSiteIdObj.startDate = startDate.format('YYYY-MM-DD');
        this.reqSiteIdObj.endDate = endDate.format('YYYY-MM-DD');
      }
    }
  }

  onMonthYearChange() {
    const month = Number(this.selectedMonth);
    const year = Number(this.selectedYear);
    const startDate = moment().year(year).month(month).startOf('month');
    const endDate = moment().year(year).month(month).endOf('month');
    this.reqSiteIdObj.startDate = startDate.format('YYYY-MM-DD');
    this.reqSiteIdObj.endDate = endDate.format('YYYY-MM-DD');
    this.reqSiteIdObj.reportMonth = startDate.format('YYYY-MM');
    this.reqSiteIdObj.reportYear = null;
  }

  onYearChange() {
    const year = Number(this.selectedYear);
    const startDate = moment().year(year).startOf('year');
    const endDate = moment().year(year).endOf('year');
    this.reqSiteIdObj.startDate = startDate.format('YYYY-MM-DD');
    this.reqSiteIdObj.endDate = endDate.format('YYYY-MM-DD');
    this.reqSiteIdObj.reportMonth = null;
    this.reqSiteIdObj.reportYear = year;
  }

  closeFilter() {
    if (this.filterType === 1) {
      this.isReqToOpenFilter = false;
      this.isReqToOpenFilterChange.emit(this.isReqToOpenFilter);
    } else if (this.filterType === 2) {
      this.isOpenTabularFilter = false;
      this.isOpenTabularFilterChange.emit(this.isOpenTabularFilter);
    }
  }

  applyTabularFilter(evt?: any) {

  }

  onFilterChange(evt?: any) {

  }
}

