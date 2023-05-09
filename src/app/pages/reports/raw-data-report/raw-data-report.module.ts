import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatDateFormats, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';

import { RawDataReportRoutingModule } from './raw-data-report-routing.module';
import { RawDataReportComponent } from './raw-data-report.component';
import { RawFilterComponent } from './raw-filter/raw-filter.component';


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
  declarations: [RawDataReportComponent, RawFilterComponent],
  imports: [
    CommonModule,
    RawDataReportRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule
  ],
  exports: [
    RawFilterComponent
  ]
})
export class RawDataReportModule { }
