import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { FaultCategoryRoutingModule } from './fault-category-routing.module';
import { FaultCategoryComponent } from './fault-category.component';
import { AddFaultCategoryComponent } from './add-fault-category/add-fault-category.component';


@NgModule({
  declarations: [FaultCategoryComponent, AddFaultCategoryComponent],
  imports: [
    CommonModule,
    FaultCategoryRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddFaultCategoryComponent
  ]
})
export class FaultCategoryModule { }
