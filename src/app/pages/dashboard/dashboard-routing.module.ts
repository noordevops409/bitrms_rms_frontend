import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ListingComponent } from './listing/listing.component';

import { SiteDetailsComponent } from '../../shared/site-details/site-details.component';
import { AlarmCategoryComponent } from '../../shared/alarm-category/alarm-category.component';
import { EnergyReportComponent } from '../../shared/energy-report/energy-report.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'type/:id', component: ListingComponent },
  { path: 'prfdash/:siteId', component: SiteDetailsComponent },
  { path: 'alarm-status/:siteId', component: AlarmCategoryComponent },
  // { path: 'alarm-status', component: AlarmCategoryComponent },
  { path: 'hourly-report/:siteId', component: EnergyReportComponent },
  // { path: 'hourly-report', component: HourlyReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
