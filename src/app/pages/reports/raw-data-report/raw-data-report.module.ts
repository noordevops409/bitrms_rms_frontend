import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { RawDataReportRoutingModule } from './raw-data-report-routing.module';
import { RawDataReportComponent } from './raw-data-report.component';
import { RawFilterComponent } from './raw-filter/raw-filter.component';


@NgModule({
  declarations: [RawDataReportComponent, RawFilterComponent],
  imports: [
    CommonModule,
    RawDataReportRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    RawFilterComponent
  ]
})
export class RawDataReportModule { }
