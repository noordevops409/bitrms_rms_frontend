import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { PlannedEnergyRoutingModule } from './planned-energy-routing.module';
import { PlannedEnergyComponent } from './planned-energy.component';
import { AddPlannedEnergyComponent } from './add-planned-energy/add-planned-energy.component';


@NgModule({
  declarations: [PlannedEnergyComponent, AddPlannedEnergyComponent],
  imports: [
    CommonModule,
    PlannedEnergyRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddPlannedEnergyComponent
  ]
})
export class PlannedEnergyModule { }
