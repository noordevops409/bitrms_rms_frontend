import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HybridPowerTrackerRoutingModule } from './hybrid-power-tracker-routing.module';
import { HybridPowerTrackerComponent } from './hybrid-power-tracker.component';


@NgModule({
  declarations: [HybridPowerTrackerComponent],
  imports: [
    CommonModule,
    HybridPowerTrackerRoutingModule
  ]
})
export class HybridPowerTrackerModule { }
