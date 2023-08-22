import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BroadcastService } from '../broadcast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tower-filter-wrapper',
  templateUrl: './tower-filter-wrapper.component.html',
  styleUrls: ['./tower-filter-wrapper.component.scss']
})
export class TowerFilterWrapperComponent implements OnInit {

  @Input() filterType: number = 1;
  @Input() filterSubType: number = 0;
  @Input() isTimerAvail: boolean = false;

  @Input() isReqToOpenFilter: boolean = false;
  @Input() isOpenTabularFilter: boolean = false;
  @Input() defaultFilterList: any;
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() isReqToOpenFilterChange = new EventEmitter();
  @Output() isOpenTabularFilterChange = new EventEmitter();

  public selectedSiteStatus: any = null;
  public selectedAlarmStatus: any = null;

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
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  public startTime: any = "00:00";
  public endTime: any = "23:59";

  private reqSiteIdObj: any = {
    startDate: null,
    endDate: null
  };

  constructor(
    private broadcast: BroadcastService
  ) { }

  ngOnInit(): void {
    this.setSiteType();
    this.setSiteStatus();
    this.setAlarmStatus();
    // this.setCustomer();
    this.setDateRange();
  }

  setSiteType() {
    if (this.defaultFilterList && this.defaultFilterList.length && this.defaultFilterList[7]) {
      this.siteType = this.defaultFilterList[7];
    }
  }

  setSiteStatus() {
    if (this.defaultFilterList && this.defaultFilterList.length && this.defaultFilterList[8]) {
      this.selectedSiteStatus = this.defaultFilterList[8];
    }
  }

  setAlarmStatus() {
    if (this.defaultFilterList && this.defaultFilterList.length && this.defaultFilterList[8]) {
      this.selectedAlarmStatus = this.defaultFilterList[8];
    }
  }

  setCustomer() {
    if (this.defaultFilterList && this.defaultFilterList.length && this.defaultFilterList[5]) {
      this.customer = this.defaultFilterList[5];
    }
  }

  setDateRange() {
    let t1: any = this.defaultFilterList;
    if (t1 && t1.length && t1[9]) {
      let t2: any = t1[9];
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

  test() {

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
      if (this.defaultFilterList && this.filterType !== 3) {
        if (!this.defaultFilterList[7]) {
          this.defaultFilterList.push(this.siteType);
        }

        if (this.defaultFilterList.length > 8) {
          this.defaultFilterList[8] = this.selectedSiteStatus || this.selectedAlarmStatus;
        } else {
          this.defaultFilterList.push(this.selectedSiteStatus || this.selectedAlarmStatus);
        }

        if (!this.defaultFilterList[9]) {
          this.defaultFilterList.push(this.reqSiteIdObj);
        }
      }
      this.onFilter.emit(this.defaultFilterList);
    }, 500);
  }

  clearSelection() {
    for (let item of this.defaultFilterList) {
      if (item && item.popupTo && item.popupTo.data && item.popupTo.data.length) {
        this.broadcast.broadcast('CLEAR_FILTER_SELECTION', item);
        item.popupTo.data = [];
      }
    }

    for (let item of this.siteType) {
      item.isChecked = false;
    }

    this.selectedSiteStatus = null;
    this.selectedAlarmStatus = null;
    this.defaultFilterList[9] = null;
  }

  reset(evt?: any) {
    this.isReqToOpenFilter = false;
    this.isOpenTabularFilter = false;
    this.range.controls['start'].setValue(moment().add(-2, 'days').toDate());
    this.range.controls['end'].setValue(moment().add(-1, 'days').toDate());
    this.clearSelection();
    this.onFilter.emit(null);
  }

  applyTabularFilter(evt?: any) {

  }

  onFilterChange(evt?: any) {
  }

}
