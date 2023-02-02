import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RcaMasterComponent } from './rca-master.component';

const routes: Routes = [
  { 
    path: '', 
    component: RcaMasterComponent,
    children: [
      { path: '', redirectTo: 'issue-category', pathMatch: 'full' },
      { path: 'issue-category', loadChildren: () => import('./issue-category/issue-category.module').then(m => m.IssueCategoryModule) },
      { path: 'outage-category', loadChildren: () => import('./outage-category/outage-category.module').then(m => m.OutageCategoryModule) },
      { path: 'fault-category', loadChildren: () => import('./fault-category/fault-category.module').then(m => m.FaultCategoryModule) }
    ] 
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RcaMasterRoutingModule { }
