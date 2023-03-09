import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { HybridEnergyRunHoursRoutingModule } from './hybrid-energy-run-hours-routing.module';
import { HybridEnergyRunHoursComponent } from './hybrid-energy-run-hours.component';
import { HybridEnergyFilterComponent } from './hybrid-energy-filter/hybrid-energy-filter.component';


@NgModule({
  declarations: [
    HybridEnergyRunHoursComponent, 
    HybridEnergyFilterComponent
  ],
  imports: [
    CommonModule,
    HybridEnergyRunHoursRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    HybridEnergyFilterComponent
  ]
})
export class HybridEnergyRunHoursModule { }
