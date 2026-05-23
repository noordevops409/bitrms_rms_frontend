import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LithLatestdataComponent } from './lith-latestdata.component';
import { LithLatestdataPart2Component } from './lith-latestdata-part2/lith-latestdata-part2.component';
import { LithLatestdataPart3Component } from './lith-latestdata-part3/lith-latestdata-part3.component';
import { LithLatestdataPart4Component } from './lith-latestdata-part4/lith-latestdata-part4.component';
import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [
  { path: '',      data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2] }, component: LithLatestdataComponent },
  { path: 'part2', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2] }, component: LithLatestdataPart2Component },
  { path: 'part3', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2] }, component: LithLatestdataPart3Component },
  { path: 'part4', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2] }, component: LithLatestdataPart4Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LithLatestdataRoutingModule { }
