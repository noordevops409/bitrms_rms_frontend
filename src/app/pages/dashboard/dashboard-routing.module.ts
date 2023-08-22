import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ListingComponent } from './listing/listing.component';

import { SiteDetailsComponent } from '../../shared/site-details/site-details.component';
import { AlarmCategoryComponent } from '../../shared/alarm-category/alarm-category.component';
import { EnergyReportComponent } from '../../shared/energy-report/energy-report.component';
import { AlertsTableComponent } from 'src/app/shared/alarm-category/alerts-table/alerts-table.component';
import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [
  { path: '', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: DashboardComponent },
  { path: 'type/:id', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: ListingComponent },
  { path: 'prfdash/:siteId', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: SiteDetailsComponent },
  { path: 'alarm-status/:siteId', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: AlarmCategoryComponent },
  { path: 'alarm-status/alerts-Tables/:type', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: AlertsTableComponent },
  // { path: 'alarm-status', component: AlarmCategoryComponent },
  { path: 'hourly-report/:siteId', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: EnergyReportComponent },
  // { path: 'hourly-report', component: HourlyReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
