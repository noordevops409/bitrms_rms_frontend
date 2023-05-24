import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { AlarmCategoryComponent } from '../shared/alarm-category/alarm-category.component';
import { EnergyReportComponent } from '../shared/energy-report/energy-report.component';

const routes: Routes = [
  { 
    path: '', 
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'alarm-status', component: AlarmCategoryComponent },
      { path: 'energy-report', component: EnergyReportComponent },
      { path: 'power-report', loadChildren: () => import('./power-report/power-report.module').then(m => m.PowerReportModule) },
      { path: 'energy-billing-report', loadChildren: () => import('./energy-billing-report/energy-billing-report.module').then(m => m.EnergyBillingReportModule) },
      { path: 'rca-report', loadChildren: () => import('./rca-report/rca-report.module').then(m => m.RcaReportModule) },
      { path: 'rca-master', loadChildren: () => import('./rca-master/rca-master.module').then(m => m.RcaMasterModule) },
      { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
      { path: 'google-data-studio', loadChildren: () => import('./google-data-studio/google-data-studio.module').then(m => m.GoogleDataStudioModule) },
      { path: 'master-data', loadChildren: () => import('./master-data/master-data.module').then(m => m.MasterDataModule) },
      { path: 'remote-commands', loadChildren: () => import('./remote-commands/remote-commands.module').then(m => m.RemoteCommandsModule) },
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
