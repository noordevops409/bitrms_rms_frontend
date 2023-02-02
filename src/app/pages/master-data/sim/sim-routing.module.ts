import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimComponent } from './sim.component';

const routes: Routes = [{ path: '', component: SimComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimRoutingModule { }
