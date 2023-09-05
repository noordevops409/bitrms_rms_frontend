import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { EnergyReportComponent } from '../shared/energy-report/energy-report.component';
import { AlarmCategoryComponent } from '../shared/alarm-category/alarm-category.component';
import { AlertsTableComponent } from '../shared/alarm-category/alerts-table/alerts-table.component';
import { AppConstant } from '../shared/app-constant.enum';
import { AuthGuardService } from '../guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, pathMatch: 'full' },
      { path: 'dashboard', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      //{ path: 'alarm-status', loadChildren: () => import('src/app/shared/alarm-category/alarm-category.module').then(m => m.AlarmCategoryModule) },

      { path: 'alarm-status', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: AlarmCategoryComponent },
      { path: 'energy-report', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: EnergyReportComponent },
      // { path: 'alarm-status', component: AlarmCategoryComponent },
      { path: 'alerts-table/:type', canActivate: [AuthGuardService], component: AlertsTableComponent },
      { path: 'power-report', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./power-report/power-report.module').then(m => m.PowerReportModule) },
      { path: 'energy-billing-report', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./energy-billing-report/energy-billing-report.module').then(m => m.EnergyBillingReportModule) },
      { path: 'rca-report', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./rca-report/rca-report.module').then(m => m.RcaReportModule) },
      { path: 'rca-master', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE] }, loadChildren: () => import('./rca-master/rca-master.module').then(m => m.RcaMasterModule) },
      { path: 'reports', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
      //{ path: 'reports', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./reports/raw-data-report/raw-data-report.module').then(m => m.RawDataReportModule) },
      { path: 'google-data-studio', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, loadChildren: () => import('./google-data-studio/google-data-studio.module').then(m => m.GoogleDataStudioModule) },
      { path: 'master-data', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE] }, loadChildren: () => import('./master-data/master-data.module').then(m => m.MasterDataModule) },
      { path: 'remote-commands', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE] }, loadChildren: () => import('./remote-commands/remote-commands.module').then(m => m.RemoteCommandsModule) },
      { path: 'users', canActivate: [AuthGuardService], data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE] }, loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
