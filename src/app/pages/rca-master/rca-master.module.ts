import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RcaMasterRoutingModule } from './rca-master-routing.module';
import { RcaMasterComponent } from './rca-master.component';


@NgModule({
  declarations: [RcaMasterComponent],
  imports: [
    CommonModule,
    RcaMasterRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class RcaMasterModule { }
