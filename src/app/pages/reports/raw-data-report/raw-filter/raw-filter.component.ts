import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { UserService } from '../../../../shared/services/user.service';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-raw-filter',
  templateUrl: './raw-filter.component.html',
  styleUrls: ['./raw-filter.component.scss']
})
export class RawFilterComponent implements OnInit {

  @Input() filterType: number = 1;

  @Input() isReqToOpenFilter: boolean = false;
  @Input() isOpenTabularFilter: boolean = false;
  @Input() defaultFilterList: any;
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() isReqToOpenFilterChange = new EventEmitter();
  @Output() isOpenTabularFilterChange = new EventEmitter();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  public maxDateRangeSel: number = 1;
  public startTime: any = "00:00";
  public endTime: any = "23:59";
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

  private reqSiteIdObj: any = {
    startDate: null,
    endDate: null
  };

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.setSiteType();
    this.setDateRange();
  }

  setMaxDateRange() {
    let authToken: any = this.userService.getAuthToken();
    if (authToken && authToken.roleId == '1') {
      this.maxDateRangeSel = 7;
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
        let split1 = t2.startDate.toString().split(" ");
        let split2 = t2.endDate.toString().split(" ");
        this.reqSiteIdObj.startDate = moment(split1[0]);
        this.reqSiteIdObj.endDate = moment(split2[0]);

        this.range.controls['start'].setValue(this.reqSiteIdObj.startDate);
        this.range.controls['end'].setValue(this.reqSiteIdObj.endDate);
      }
    } else {
      this.range.controls['start'].setValue(moment().add(-2, 'days').toDate());
      this.range.controls['end'].setValue(moment().add(-1, 'days').toDate());
    }
  }

  dateRangeChange(type: any, evt: any) {
    if (this.range.controls['start'].value && this.range.controls['end'].value) {
      let startDate: any = null;
      let endDate: any = null;
      if (this.startTime) {
        startDate = moment(moment(this.range.controls['start'].value).format("YYYY-MM-DD") + ' ' + this.startTime + ':00').format('YYYY-MM-DD HH:mm:ss');
      } else {
        startDate = moment(this.range.controls['start'].value).format('YYYY-MM-DD');
      }

      if (this.endTime) {
        endDate = moment(moment(this.range.controls['end'].value).format("YYYY-MM-DD") + ' ' + this.endTime + ':00').format('YYYY-MM-DD HH:mm:ss');
      } else {
        endDate = moment(this.range.controls['end'].value).format('YYYY-MM-DD');
      }

      this.reqSiteIdObj.startDate = startDate;
      this.reqSiteIdObj.endDate = endDate;
    }
  }

  reset(evt?: any) {
    this.range.controls['start'].setValue(moment().add(-2, 'days').toDate());
    this.range.controls['end'].setValue(moment().add(-1, 'days').toDate());
    if (this.filterType === 1) {
      this.isReqToOpenFilter = false;
      this.isReqToOpenFilterChange.emit(this.isReqToOpenFilter);
    } else if (this.filterType === 2) {
      this.isOpenTabularFilter = false;
      this.isOpenTabularFilterChange.emit(this.isOpenTabularFilter);
    }
    this.onFilter.emit(null);
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
      if (this.startTime && this.endTime) {

      }
      this.defaultFilterList.push(this.siteType);
      this.defaultFilterList.push(this.reqSiteIdObj);
      this.onFilter.emit(this.defaultFilterList);
    }, 500);
  }

  applyTabularFilter(evt?: any) {

  }

  onFilterChange(evt?: any) {

  }

}
