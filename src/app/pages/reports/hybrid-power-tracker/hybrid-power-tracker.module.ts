import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { HybridPowerTrackerRoutingModule } from './hybrid-power-tracker-routing.module';
import { HybridPowerTrackerComponent } from './hybrid-power-tracker.component';
import { HybridPowerFilterComponent } from './hybrid-power-filter/hybrid-power-filter.component';


@NgModule({
  declarations: [HybridPowerTrackerComponent, HybridPowerFilterComponent],
  imports: [
    CommonModule,
    HybridPowerTrackerRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    HybridPowerFilterComponent
  ]
})
export class HybridPowerTrackerModule { }
