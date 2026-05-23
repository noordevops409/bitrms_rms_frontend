import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppConstant } from '../../shared/app-constant.enum';
import { BattLifeCycleCountComponent } from './batt-life-cycle-count.component';

const routes: Routes = [
  {
    path: '',
    data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE, AppConstant.ROUTE_ACCESS_ID.NOC2,AppConstant.ROUTE_ACCESS_ID.NOC1,AppConstant.ROUTE_ACCESS_ID.CUSTOMER] },
    component: BattLifeCycleCountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BattLifeCycleCountRoutingModule { }
