import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ListingComponent } from './listing/listing.component';

import { SiteDetailsComponent } from '../../shared/site-details/site-details.component';
import { AlarmCategoryComponent } from '../../shared/alarm-category/alarm-category.component';
import { EnergyReportComponent } from '../../shared/energy-report/energy-report.component';
import { AlertsTableComponent } from 'src/app/shared/alarm-category/alerts-table/alerts-table.component';
import { AppConstant } from '../../shared/app-constant.enum';
import { RawDataReportComponent } from '../reports/raw-data-report/raw-data-report.component';

const routes: Routes = [
  { path: '', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, component: DashboardComponent },
  { path: 'type/:id', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, component: ListingComponent },
  { path: 'prfdash/:siteId', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, component: SiteDetailsComponent },
  { path: 'alarm-status/:siteId', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, component: AlarmCategoryComponent },
  { path: 'alarm-status/alerts-Tables/:type', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, component: AlertsTableComponent },
  // { path: 'alarm-status', component: AlarmCategoryComponent },
  { path: 'hourly-report/:siteId', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, component: EnergyReportComponent },
  { path: 'raw-data-report/:siteId', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] }, component: RawDataReportComponent },

  // { path: 'hourly-report', component: HourlyReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
