import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsComponent } from './reports.component';
import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [
  { 
    path: '', 
    component: ReportsComponent,
    children: [
      { path: '', redirectTo: 'tee-power-tracker', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER,AppConstant.ROUTE_ACCESS_ID.PHP] }, pathMatch: 'full' },
      { path: 'raw-data-report', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER,AppConstant.ROUTE_ACCESS_ID.PHP] }, loadChildren: () => import('./raw-data-report/raw-data-report.module').then(m => m.RawDataReportModule) },
      { path: 'tee-power-tracker', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER,AppConstant.ROUTE_ACCESS_ID.PHP] }, loadChildren: () => import('./tee-power-tracker/tee-power-tracker.module').then(m => m.TeePowerTrackerModule) },
      { path: 'hybrid-power-tracker', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER,AppConstant.ROUTE_ACCESS_ID.PHP] }, loadChildren: () => import('./hybrid-power-tracker/hybrid-power-tracker.module').then(m => m.HybridPowerTrackerModule) },
      { path: 'tee-energy-run-hours', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, loadChildren: () => import('./tee-energy-run-hours/tee-energy-run-hours.module').then(m => m.TeeEnergyRunHoursModule) },
      { path: 'hybrid-energy-run-hours', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, loadChildren: () => import('./hybrid-energy-run-hours/hybrid-energy-run-hours.module').then(m => m.HybridEnergyRunHoursModule) }, 
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
