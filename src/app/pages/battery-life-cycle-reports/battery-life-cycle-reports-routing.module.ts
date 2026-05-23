import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppConstant } from '../../shared/app-constant.enum';
import { BatteryLifeCycleReportsComponent } from './battery-life-cycle-reports.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'daily',
    pathMatch: 'full'
  },
  {
    path: 'daily',
    data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER], viewType: 'daily' },
    component: BatteryLifeCycleReportsComponent
  },
  {
    path: 'monthly',
    data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER], viewType: 'monthly' },
    component: BatteryLifeCycleReportsComponent
  },
  {
    path: 'yearly',
    data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER], viewType: 'yearly' },
    component: BatteryLifeCycleReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatteryLifeCycleReportsRoutingModule { }
