import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PowerReportRoutingModule } from './power-report-routing.module';
import { PowerReportComponent } from './power-report.component';


@NgModule({
  declarations: [
    PowerReportComponent
  ],
  imports: [
    CommonModule,
    PowerReportRoutingModule
  ]
})
export class PowerReportModule { }
