import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegionComponent } from './region.component';
import { AppConstant } from '../../../shared/app-constant.enum';

const routes: Routes = [{ path: '', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE] }, component: RegionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionRoutingModule { }
