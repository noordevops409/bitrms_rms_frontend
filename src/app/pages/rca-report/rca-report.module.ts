import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { RcaReportRoutingModule } from './rca-report-routing.module';
import { RcaReportComponent } from './rca-report.component';
import { AddEditRcaReportComponent } from './add-edit-rca-report/add-edit-rca-report.component';

import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatDateFormats, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';

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
  declarations: [RcaReportComponent, AddEditRcaReportComponent],
  imports: [
    CommonModule,
    RcaReportRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule
  ],
  exports: [
    AddEditRcaReportComponent
  ],
  providers: [
    { provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class RcaReportModule { }
