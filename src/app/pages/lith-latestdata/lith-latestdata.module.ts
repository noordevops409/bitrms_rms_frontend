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
import { LithLatestdataPart3Component } from './lith-latestdata-part3/lith-latestdata-part3.component';
import { LithLatestdataPart4Component } from './lith-latestdata-part4/lith-latestdata-part4.component';

@NgModule({
  declarations: [
    LithLatestdataComponent,
    LithLatestdataPart2Component,
    LithLatestdataPart3Component,
    LithLatestdataPart4Component
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
    LithLatestdataPart2Component,
    LithLatestdataPart3Component,
    LithLatestdataPart4Component
  ]
})
export class LithLatestdataModule { }
