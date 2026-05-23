import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { BatteryLifeCycleReportsRoutingModule } from './battery-life-cycle-reports-routing.module';
import { BattLifeCycleCountModule } from '../batt-life-cycle-count/batt-life-cycle-count.module';

import { BatteryLifeCycleReportsComponent } from './battery-life-cycle-reports.component';

@NgModule({
  declarations: [BatteryLifeCycleReportsComponent],
  imports: [
    CommonModule,
    BatteryLifeCycleReportsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    BattLifeCycleCountModule
  ]
})
export class BatteryLifeCycleReportsModule { }
