import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tee-power-filter',
  templateUrl: './tee-power-filter.component.html',
  styleUrls: ['./tee-power-filter.component.scss']
})
export class TeePowerFilterComponent implements OnInit {

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
