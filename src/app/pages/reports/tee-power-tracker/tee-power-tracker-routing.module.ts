import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeePowerTrackerComponent } from './tee-power-tracker.component';

const routes: Routes = [{ path: '', component: TeePowerTrackerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeePowerTrackerRoutingModule { }
