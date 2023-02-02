import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlannedEnergyComponent } from './planned-energy.component';

const routes: Routes = [{ path: '', component: PlannedEnergyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannedEnergyRoutingModule { }
