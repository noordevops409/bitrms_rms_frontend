import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import { BroadcastService } from '../broadcast.service';

@Component({
  selector: 'app-filter-wrapper',
  templateUrl: './filter-wrapper.component.html',
  styleUrls: ['./filter-wrapper.component.scss']
})
export class FilterWrapperComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('elemSelectDD', { static: true }) $elemSelectDD: any;

  @Input('defaultFilterList') defaultFilterList: any;

  @Input('listingType') listingType: number = 0;

  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();

  private $: any = (window as any)['jQuery'];

  constructor(
    private broadcast: BroadcastService
  ) { }

  ngOnInit(): void {
    //console.log(this.defaultFilterList);
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
    
  }

  setDefaultQueries() {

  }

  onMouseover(evt: any) {
    
  }
 
  clearSelection(item: any, index: any) {
    item.popupTo.data = [];
    this.broadcast.broadcast('CLEAR_FILTER_SELECTION', item);
    this.onSelectionChange.emit(item);
  }

  doFilter(evt: any) {
    this.onSelectionChange.emit(evt);
  }

  closeFilterDropdown(evt: any) {
    this.onSelectionChange.emit(evt);
  }

}
