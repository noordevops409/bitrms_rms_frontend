import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RcaReportComponent } from './rca-report.component';

const routes: Routes = [
  { 
    path: '', 
    component: RcaReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RcaReportRoutingModule { }
