import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaultCategoryComponent } from './fault-category.component';

const routes: Routes = [{ path: '', component: FaultCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaultCategoryRoutingModule { }
