import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsComponent } from './reports.component';

const routes: Routes = [
  { 
    path: '', 
    component: ReportsComponent,
    children: [
      { path: '', redirectTo: 'raw-data-report', pathMatch: 'full' },
      { path: 'raw-data-report', loadChildren: () => import('./raw-data-report/raw-data-report.module').then(m => m.RawDataReportModule) },
      { path: 'tee-power-tracker', loadChildren: () => import('./tee-power-tracker/tee-power-tracker.module').then(m => m.TeePowerTrackerModule) },
      { path: 'hybrid-power-tracker', loadChildren: () => import('./hybrid-power-tracker/hybrid-power-tracker.module').then(m => m.HybridPowerTrackerModule) },
      { path: 'tee-energy-run-hours', loadChildren: () => import('./tee-energy-run-hours/tee-energy-run-hours.module').then(m => m.TeeEnergyRunHoursModule) },
      { path: 'hybrid-energy-run-hours', loadChildren: () => import('./hybrid-energy-run-hours/hybrid-energy-run-hours.module').then(m => m.HybridEnergyRunHoursModule) }, 
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
