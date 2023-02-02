import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeeEnergyRunHoursRoutingModule } from './tee-energy-run-hours-routing.module';
import { TeeEnergyRunHoursComponent } from './tee-energy-run-hours.component';


@NgModule({
  declarations: [TeeEnergyRunHoursComponent],
  imports: [
    CommonModule,
    TeeEnergyRunHoursRoutingModule
  ]
})
export class TeeEnergyRunHoursModule { }
