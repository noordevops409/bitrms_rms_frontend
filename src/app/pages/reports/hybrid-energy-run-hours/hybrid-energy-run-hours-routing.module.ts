import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HybridEnergyRunHoursComponent } from './hybrid-energy-run-hours.component';

const routes: Routes = [{ path: '', component: HybridEnergyRunHoursComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HybridEnergyRunHoursRoutingModule { }
