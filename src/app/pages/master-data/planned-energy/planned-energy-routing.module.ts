import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlannedEnergyComponent } from './planned-energy.component';
import { AppConstant } from '../../../shared/app-constant.enum';

const routes: Routes = [{ path: '', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE] }, component: PlannedEnergyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannedEnergyRoutingModule { }
