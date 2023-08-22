import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerReportComponent } from './power-report.component';

import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [{ path: '', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE] }, component: PowerReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PowerReportRoutingModule { }
