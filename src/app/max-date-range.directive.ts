import { Component, Injectable, Inject, Directive, Input } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MatDatepicker,
  MatDateRangePicker,
  MAT_DATE_RANGE_SELECTION_STRATEGY
} from "@angular/material/datepicker";
import { MaxRangeSelectionStrategy } from './shared/max-range-selection-strategy';

@Directive({
  selector: '[maxRange]',
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: MaxRangeSelectionStrategy
    }
  ]
})
export class MaxDateRangeDirective {

  constructor(
    @Inject(MAT_DATE_RANGE_SELECTION_STRATEGY)
    private maxRangeStrategy: MaxRangeSelectionStrategy<any>
  ) { }
  @Input() set maxRange(value: number) {
    this.maxRangeStrategy.delta = +value || 7;
  }

}
