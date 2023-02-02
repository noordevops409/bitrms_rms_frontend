import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeeEnergyRunHoursComponent } from './tee-energy-run-hours.component';

const routes: Routes = [{ path: '', component: TeeEnergyRunHoursComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeeEnergyRunHoursRoutingModule { }
