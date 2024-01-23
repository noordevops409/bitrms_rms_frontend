import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-hybrid-power-filter',
  templateUrl: './hybrid-power-filter.component.html',
  styleUrls: ['./hybrid-power-filter.component.scss']
})
export class HybridPowerFilterComponent implements OnInit {
  @Input() filterType: number = 1;

  @Input() isReqToOpenFilter: boolean = false;
  @Input() isOpenTabularFilter: boolean = false;
  @Input() defaultFilterList: any;
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() isReqToOpenFilterChange = new EventEmitter();
  @Output() isOpenTabularFilterChange = new EventEmitter();

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
    startDate: null,
    endDate: null
  };

  constructor() { }

  ngOnInit(): void {
    this.setSiteType();
   // this.setDateRange();
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
      this.range.controls['start'].setValue(moment().add(-2, 'days').toDate());
      this.range.controls['end'].setValue(moment().add(-1, 'days').toDate());
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

  reset(evt?: any) {
    var closeButton = document.querySelector('.mat-icon.notranslate.grp-btn.fa.fa-close.fa-times.material-icons.mat-ligature-font.mat-icon-no-color.ng-star-inserted') as HTMLButtonElement;    if (closeButton) {
      closeButton.click();
    } else {
    //  console.log('Button not found');
    }
    this.range.controls['start'].setValue(moment().add(-2, 'days').toDate());
    this.range.controls['end'].setValue(moment().add(-1, 'days').toDate());

    const formattedStartDate = moment(this.range.controls['start'].value).format('YYYY/MM/DD');
    const formattedEndDate = moment(this.range.controls['end'].value).format('YYYY/MM/DD');
    this.reqSiteIdObj.startDate = formattedStartDate;
    this.reqSiteIdObj.endDate = formattedEndDate;

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
    this.defaultFilterList.push(this.siteType);
    this.defaultFilterList.push(this.reqSiteIdObj);
    this.onFilter.emit(this.defaultFilterList);
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
