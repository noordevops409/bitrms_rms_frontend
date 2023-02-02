import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HybridPowerTrackerComponent } from './hybrid-power-tracker.component';

const routes: Routes = [{ path: '', component: HybridPowerTrackerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HybridPowerTrackerRoutingModule { }
