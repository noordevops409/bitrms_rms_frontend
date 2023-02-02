import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { SimRoutingModule } from './sim-routing.module';
import { SimComponent } from './sim.component';
import { AddSimComponent } from './add-sim/add-sim.component';


@NgModule({
  declarations: [SimComponent, AddSimComponent],
  imports: [
    CommonModule,
    SimRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddSimComponent
  ]
})
export class SimModule { }
