import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { EnergyReportComponent } from '../shared/energy-report/energy-report.component';
import { AlarmCategoryComponent } from '../shared/alarm-category/alarm-category.component';
import { AlertsTableComponent } from '../shared/alarm-category/alerts-table/alerts-table.component';
import { AppConstant } from '../shared/app-constant.enum';
import { AuthGuardService } from '../guards/auth-guard.service';
import { DgMaintenanceAlertModule } from './dg-maintenance-alert/dg-maintenance-alert.module';
import { SettableLoadModule } from './settable-load/settable-load-module.module';
import { DgMaintenanceAlertComponent } from './dg-maintenance-alert/dg-maintenance-alert.component';
import { SettableLoadComponent } from './settable-load/settable-load.component';
import { BattLifeCycleCountComponent } from './batt-life-cycle-count/batt-life-cycle-count.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER,AppConstant.ROUTE_ACCESS_ID.PHP] }, pathMatch: 'full' },
      { path: 'dashboard', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER,AppConstant.ROUTE_ACCESS_ID.PHP] }, loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      //{ path: 'alarm-status', loadChildren: () => import('src/app/shared/alarm-category/alarm-category.module').then(m => m.AlarmCategoryModule) },

      { path: 'alarm-status', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER,AppConstant.ROUTE_ACCESS_ID.PHP] }, component: AlarmCategoryComponent },
      { path: 'dg-maintenance-alert', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.PHP ] }, component: DgMaintenanceAlertComponent },
     // { path: 'dg-maintenance-alert', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1, AppConstant.ROUTE_ACCESS_ID.NOC2] }, loadChildren: () => import('./dg-maintenance-alert/dg-maintenance-alert.module').then(m => m.DgMaintenanceAlertComponent) },
      { path: 'settable-load', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.PHP ] }, component: SettableLoadComponent },
      // { path: 'batt-life-cycle-count', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, ] }, component: BattLifeCycleCountComponent },
      { path: 'batt-life-cycle-count', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.PHP] }, loadChildren: () => import('./batt-life-cycle-count/batt-life-cycle-count.module').then(m => m.BattLifeCycleCountModule) },

      { path: 'energy-report', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, component: EnergyReportComponent },
      // { path: 'alarm-status', component: AlarmCategoryComponent },
      { path: 'alerts-table/:type', canActivate: [AuthGuardService], component: AlertsTableComponent },
      { path: 'power-report', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, loadChildren: () => import('./power-report/power-report.module').then(m => m.PowerReportModule) },
      { path: 'energy-billing-report', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, loadChildren: () => import('./energy-billing-report/energy-billing-report.module').then(m => m.EnergyBillingReportModule) },
      { path: 'rca-report', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER,AppConstant.ROUTE_ACCESS_ID.PHP] }, loadChildren: () => import('./rca-report/rca-report.module').then(m => m.RcaReportModule) },
      { path: 'rca-master', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, loadChildren: () => import('./rca-master/rca-master.module').then(m => m.RcaMasterModule) },
      { path: 'reports', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER,AppConstant.ROUTE_ACCESS_ID.PHP] }, loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
      { path: 'lithlatestdata', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2] }, loadChildren: () => import('./lith-latestdata/lith-latestdata.module').then(m => m.LithLatestdataModule) },
      { path: 'google-data-studio', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER,AppConstant.ROUTE_ACCESS_ID.PHP] }, loadChildren: () => import('./google-data-studio/google-data-studio.module').then(m => m.GoogleDataStudioModule) },
      { path: 'master-data', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, loadChildren: () => import('./master-data/master-data.module').then(m => m.MasterDataModule) },
      { path: 'remote-commands', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, loadChildren: () => import('./remote-commands/remote-commands.module').then(m => m.RemoteCommandsModule) },
      { path: 'users', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
