import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RawDataReportComponent } from './raw-data-report.component';

const routes: Routes = [{ path: '', component: RawDataReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RawDataReportRoutingModule { }
