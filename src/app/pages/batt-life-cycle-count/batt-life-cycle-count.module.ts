import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { BattLifeCycleCountRoutingModule } from './batt-life-cycle-count-routing.module';

import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatDateFormats, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { BattLifeCycleCountComponent } from './batt-life-cycle-count.component';
import { BattLifeCycleCountFilterComponent } from './batt-life-cycle-count-filter/batt-life-cycle-count-filter.component';

// If using Moment
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS"
  },
  display: {
    dateInput: "l, LTS",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@NgModule({
  declarations: [BattLifeCycleCountComponent, BattLifeCycleCountFilterComponent],
  imports: [
    CommonModule,
    BattLifeCycleCountRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule
  ],
  exports: [BattLifeCycleCountFilterComponent],

  providers: [
    { provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class BattLifeCycleCountModule { }
