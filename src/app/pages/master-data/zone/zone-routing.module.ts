import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZoneComponent } from './zone.component';
import { AppConstant } from '../../../shared/app-constant.enum';

const routes: Routes = [{ path: '', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE] }, component: ZoneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZoneRoutingModule { }
