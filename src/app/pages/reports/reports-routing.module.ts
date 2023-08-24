import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsComponent } from './reports.component';
import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [
  { 
    path: '', 
    component: ReportsComponent,
    children: [
      { path: '', redirectTo: 'tee-power-tracker', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, pathMatch: 'full' },
      { path: 'raw-data-report', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./raw-data-report/raw-data-report.module').then(m => m.RawDataReportModule) },
      { path: 'tee-power-tracker', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./tee-power-tracker/tee-power-tracker.module').then(m => m.TeePowerTrackerModule) },
      { path: 'hybrid-power-tracker', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./hybrid-power-tracker/hybrid-power-tracker.module').then(m => m.HybridPowerTrackerModule) },
      { path: 'tee-energy-run-hours', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./tee-energy-run-hours/tee-energy-run-hours.module').then(m => m.TeeEnergyRunHoursModule) },
      { path: 'hybrid-energy-run-hours', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./hybrid-energy-run-hours/hybrid-energy-run-hours.module').then(m => m.HybridEnergyRunHoursModule) }, 
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
