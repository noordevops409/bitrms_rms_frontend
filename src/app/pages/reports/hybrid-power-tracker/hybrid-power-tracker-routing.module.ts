import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HybridPowerTrackerComponent } from './hybrid-power-tracker.component';
import { AppConstant } from '../../../shared/app-constant.enum';

const routes: Routes = [{ path: '', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: HybridPowerTrackerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HybridPowerTrackerRoutingModule { }
