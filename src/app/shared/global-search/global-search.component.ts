import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {
  /**
    * @description send value to it's parent component
    * @type {*}
    * @memberof RCA Report component
    */
  @Output() searchEventTrigger: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  /**
  * @description Key press event 
  * @type {*}
  * @memberof Global search component
  */
  keyPress(event: any) {
    console.log(event);
    setTimeout(() => {
      this.searchEventTrigger.emit(event);
    }, 500);
  }

  clear(event: any) {
    (document as any).getElementById('selectSiteName').value = "";
    event.target.value = "";
    this.searchEventTrigger.emit(event);
  }
}
