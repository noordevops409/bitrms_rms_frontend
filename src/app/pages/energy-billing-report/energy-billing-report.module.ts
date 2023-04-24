import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnergyBillingReportRoutingModule } from './energy-billing-report-routing.module';
import { EnergyBillingReportComponent } from './energy-billing-report.component';


@NgModule({
  declarations: [
    EnergyBillingReportComponent
  ],
  imports: [
    CommonModule,
    EnergyBillingReportRoutingModule
  ]
})
export class EnergyBillingReportModule { }
