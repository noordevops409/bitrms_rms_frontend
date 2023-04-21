import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-tower-filter-wrapper',
  templateUrl: './tower-filter-wrapper.component.html',
  styleUrls: ['./tower-filter-wrapper.component.scss']
})
export class TowerFilterWrapperComponent implements OnInit {

  @Input() filterType: number = 1;

  @Input() isReqToOpenFilter: boolean = false;
  @Input() isOpenTabularFilter: boolean = false;
  @Input() defaultFilterList: any;
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() isReqToOpenFilterChange = new EventEmitter();
  @Output() isOpenTabularFilterChange = new EventEmitter();

  public selectedSiteStatus: any = null;

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

  public siteStatus: any = [
    {
      isChecked: false,
      text: 'All'
    },
    {
      isChecked: false,
      text: 'Offline'
    },
    {
      isChecked: false,
      text: 'Online'
    }
  ];

  public customer: any = [
    {
      isChecked: false,
      text: 'All'
    },
    {
      isChecked: false,
      text: 'IGT'
    },
    {
      isChecked: false,
      text: 'Apollo'
    }
  ];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  private reqSiteIdObj: any = {
    startDate: null,
    endDate: null
  };

  constructor() { }

  ngOnInit(): void {
    this.setSiteType();
    this.setSiteStatus();
    this.setCustomer();
    this.setDateRange();
  }

  setSiteType() {
    if (this.defaultFilterList && this.defaultFilterList.length && this.defaultFilterList[5]) {
      this.siteType = this.defaultFilterList[5];
    }
  }

  setSiteStatus() {
    if (this.defaultFilterList && this.defaultFilterList.length && this.defaultFilterList[7]) {
      this.selectedSiteStatus = this.defaultFilterList[7];
    }
  }

  setCustomer() {
    if (this.defaultFilterList && this.defaultFilterList.length && this.defaultFilterList[8]) {
      this.customer = this.defaultFilterList[8];
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
    }
  }

  dateRangeChange(type: any, evt: any) {
    if (this.range.controls['start'].value && this.range.controls['end'].value) {
      let startDate = moment(this.range.controls['start'].value).format('YYYY-MM-DD');
      let endDate = moment(this.range.controls['end'].value).format('YYYY-MM-DD');
      this.reqSiteIdObj.startDate = startDate;
      this.reqSiteIdObj.endDate = endDate;
    }
  }

  test() {

  }

  applyFilter(evt?: any) {
    if (this.filterType === 1) {
      this.isReqToOpenFilter = false;
      this.isReqToOpenFilterChange.emit(this.isReqToOpenFilter);
    } else if (this.filterType === 2) {
      this.isOpenTabularFilter = false;
      this.isOpenTabularFilterChange.emit(this.isOpenTabularFilter);
    }
    if (this.defaultFilterList && this.filterType !== 3) {
      if (!this.defaultFilterList[5]) {
        this.defaultFilterList.push(this.siteType);
      }
      if (!this.defaultFilterList[6]) {
        this.defaultFilterList.push(this.reqSiteIdObj);
      }

      if (!this.defaultFilterList[7]) {
        this.defaultFilterList.push(this.selectedSiteStatus);
      }

      if (!this.defaultFilterList[8]) {
        this.defaultFilterList.push(this.customer);
      }
    }
    this.onFilter.emit(this.defaultFilterList);
  }

  reset(evt?: any) {
    this.isReqToOpenFilter = false;
    this.isOpenTabularFilter = false;
    this.onFilter.emit(null);
  }

  applyTabularFilter(evt?: any) {

  }

  onFilterChange(evt?: any) {

  }

}
