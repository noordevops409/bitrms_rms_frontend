import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { ZoneRoutingModule } from './zone-routing.module';
import { ZoneComponent } from './zone.component';
import { AddZoneComponent } from './add-zone/add-zone.component';


@NgModule({
  declarations: [ZoneComponent, AddZoneComponent],
  imports: [
    CommonModule,
    ZoneRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddZoneComponent
  ]
})
export class ZoneModule { }
