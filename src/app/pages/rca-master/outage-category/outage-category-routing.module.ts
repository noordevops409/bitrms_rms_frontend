import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutageCategoryComponent } from './outage-category.component';
import { AppConstant } from '../../../shared/app-constant.enum';

const routes: Routes = [{ path: '', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, component: OutageCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutageCategoryRoutingModule { }
