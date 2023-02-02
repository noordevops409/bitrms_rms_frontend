import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueCategoryComponent } from './issue-category.component';

const routes: Routes = [{ path: '', component: IssueCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueCategoryRoutingModule { }
