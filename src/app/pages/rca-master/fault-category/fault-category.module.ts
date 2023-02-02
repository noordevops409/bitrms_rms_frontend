import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaultCategoryRoutingModule } from './fault-category-routing.module';
import { FaultCategoryComponent } from './fault-category.component';
import { AddFaultCategoryComponent } from './add-fault-category/add-fault-category.component';


@NgModule({
  declarations: [FaultCategoryComponent, AddFaultCategoryComponent],
  imports: [
    CommonModule,
    FaultCategoryRoutingModule
  ],
  exports: [
    AddFaultCategoryComponent
  ]
})
export class FaultCategoryModule { }
