import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  applyFilter(evt?: any) {
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
