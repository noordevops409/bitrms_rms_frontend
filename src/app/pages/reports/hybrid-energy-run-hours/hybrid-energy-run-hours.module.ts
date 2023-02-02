import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HybridEnergyRunHoursRoutingModule } from './hybrid-energy-run-hours-routing.module';
import { HybridEnergyRunHoursComponent } from './hybrid-energy-run-hours.component';


@NgModule({
  declarations: [HybridEnergyRunHoursComponent],
  imports: [
    CommonModule,
    HybridEnergyRunHoursRoutingModule
  ]
})
export class HybridEnergyRunHoursModule { }
