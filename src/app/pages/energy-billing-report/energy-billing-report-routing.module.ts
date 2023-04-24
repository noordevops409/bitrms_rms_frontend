import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnergyBillingReportComponent } from './energy-billing-report.component';

const routes: Routes = [{ path: '', component: EnergyBillingReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnergyBillingReportRoutingModule { }
