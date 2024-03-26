import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RcaMasterComponent } from './rca-master.component';
import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [
  { 
    path: '', 
    component: RcaMasterComponent,
    children: [
      { path: '', redirectTo: 'issue-category', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, pathMatch: 'full' },
      { path: 'issue-category', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, loadChildren: () => import('./issue-category/issue-category.module').then(m => m.IssueCategoryModule) },
      { path: 'outage-category', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, loadChildren: () => import('./outage-category/outage-category.module').then(m => m.OutageCategoryModule) },
      { path: 'fault-category', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, loadChildren: () => import('./fault-category/fault-category.module').then(m => m.FaultCategoryModule) }
    ] 
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RcaMasterRoutingModule { }
