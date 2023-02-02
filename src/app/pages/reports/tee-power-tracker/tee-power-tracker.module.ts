import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { TeePowerTrackerRoutingModule } from './tee-power-tracker-routing.module';
import { TeePowerTrackerComponent } from './tee-power-tracker.component';
import { TeePowerFilterComponent } from './tee-power-filter/tee-power-filter.component';


@NgModule({
  declarations: [TeePowerTrackerComponent, TeePowerFilterComponent],
  imports: [
    CommonModule,
    TeePowerTrackerRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    TeePowerFilterComponent
  ]
})
export class TeePowerTrackerModule { }
