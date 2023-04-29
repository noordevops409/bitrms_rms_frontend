import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from '../../shared/shared.module';

import { MaterialModule } from '../../material/material.module';
import { PowerReportRoutingModule } from './power-report-routing.module';
import { PowerReportComponent } from './power-report.component';


@NgModule({
  declarations: [
    PowerReportComponent
  ],
  imports: [
    CommonModule,
    PowerReportRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    ChartistModule,
    NgChartsModule
  ]
})
export class PowerReportModule { }
