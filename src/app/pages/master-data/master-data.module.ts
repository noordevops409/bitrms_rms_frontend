import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { MasterDataComponent } from './master-data.component';


@NgModule({
  declarations: [MasterDataComponent],
  imports: [
    CommonModule,
    MasterDataRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class MasterDataModule { }
