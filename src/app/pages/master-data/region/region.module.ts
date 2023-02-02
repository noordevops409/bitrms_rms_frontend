import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { RegionRoutingModule } from './region-routing.module';
import { RegionComponent } from './region.component';
import { AddRegionComponent } from './add-region/add-region.component';


@NgModule({
  declarations: [RegionComponent, AddRegionComponent],
  imports: [
    CommonModule,
    RegionRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddRegionComponent
  ]
})
export class RegionModule { }
