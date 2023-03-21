import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { RegionRoutingModule } from './region-routing.module';
import { RegionComponent } from './region.component';
import { AddRegionComponent } from './add-region/add-region.component';

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
  declarations: [RegionComponent, AddRegionComponent],
  imports: [
    CommonModule,
    RegionRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule
  ],
  exports: [
    AddRegionComponent
  ]
})
export class RegionModule { }
