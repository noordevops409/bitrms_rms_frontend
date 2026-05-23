import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartistModule } from 'ng-chartist';
import { NgChartsModule } from 'ng2-charts';

import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
import { LithLatestdataRoutingModule } from './lith-latestdata-routing.module';

import { LithLatestdataComponent } from './lith-latestdata.component';
import { LithLatestdataPart2Component } from './lith-latestdata-part2/lith-latestdata-part2.component';

@NgModule({
  declarations: [
    LithLatestdataComponent,
    LithLatestdataPart2Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    ChartistModule,
    NgChartsModule,
    LithLatestdataRoutingModule
  ],
  exports: [
    LithLatestdataComponent,
    LithLatestdataPart2Component // Optional: export if you need it outside
  ]
})
export class LithLatestdataModule { }
