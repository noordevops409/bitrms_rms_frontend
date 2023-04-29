import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from '../../shared/shared.module';
import { EnergyBillingReportRoutingModule } from './energy-billing-report-routing.module';
import { EnergyBillingReportComponent } from './energy-billing-report.component';


@NgModule({
  declarations: [
    EnergyBillingReportComponent
  ],
  imports: [
    CommonModule,
    EnergyBillingReportRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    ChartistModule,
    NgChartsModule,
    SharedModule
  ]
})
export class EnergyBillingReportModule { }
