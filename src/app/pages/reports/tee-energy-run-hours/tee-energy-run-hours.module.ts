import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MaterialModule } from '../../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { TeeEnergyRunHoursRoutingModule } from './tee-energy-run-hours-routing.module';
import { TeeEnergyRunHoursComponent } from './tee-energy-run-hours.component';
import { TeeEnergyFilterComponent } from './tee-energy-filter/tee-energy-filter.component';


@NgModule({
  declarations: [TeeEnergyRunHoursComponent, TeeEnergyFilterComponent],
  imports: [
    CommonModule,
    TeeEnergyRunHoursRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    TeeEnergyFilterComponent
  ]
})
export class TeeEnergyRunHoursModule { }
