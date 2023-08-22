import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RcaMasterComponent } from './rca-master.component';
import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [
  { 
    path: '', 
    component: RcaMasterComponent,
    children: [
      { path: '', redirectTo: 'issue-category', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE] }, pathMatch: 'full' },
      { path: 'issue-category', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE] }, loadChildren: () => import('./issue-category/issue-category.module').then(m => m.IssueCategoryModule) },
      { path: 'outage-category', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE] }, loadChildren: () => import('./outage-category/outage-category.module').then(m => m.OutageCategoryModule) },
      { path: 'fault-category', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE] }, loadChildren: () => import('./fault-category/fault-category.module').then(m => m.FaultCategoryModule) }
    ] 
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RcaMasterRoutingModule { }
