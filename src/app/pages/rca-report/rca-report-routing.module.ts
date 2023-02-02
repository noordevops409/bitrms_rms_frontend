import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RcaReportComponent } from './rca-report.component';

import { RcaReportDialogEntryComponent } from './rca-report-dialog-entry/rca-report-dialog-entry.component';

const routes: Routes = [
  { 
    path: '', 
    component: RcaReportComponent,
    children: [
      { path: 'add', component: RcaReportDialogEntryComponent },
      { path: 'edit/:id', component: RcaReportDialogEntryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RcaReportRoutingModule { }
