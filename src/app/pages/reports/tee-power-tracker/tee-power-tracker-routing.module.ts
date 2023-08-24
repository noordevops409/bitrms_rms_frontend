import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeePowerTrackerComponent } from './tee-power-tracker.component';
import { AppConstant } from '../../../shared/app-constant.enum';

const routes: Routes = [{ path: '', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: TeePowerTrackerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeePowerTrackerRoutingModule { }
