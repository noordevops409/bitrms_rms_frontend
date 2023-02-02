import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutageCategoryComponent } from './outage-category.component';

const routes: Routes = [{ path: '', component: OutageCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutageCategoryRoutingModule { }
