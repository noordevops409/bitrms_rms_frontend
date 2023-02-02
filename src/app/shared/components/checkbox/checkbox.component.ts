import { Component, OnInit, Input, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit, OnDestroy {

  @Input() inputData: any;

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnDestroy() {

  }

  onChangeEvent($event: any) {
    this.inputData.isChecked = !this.inputData.isChecked;
    this.onChange.emit(this.inputData);
  }

}
