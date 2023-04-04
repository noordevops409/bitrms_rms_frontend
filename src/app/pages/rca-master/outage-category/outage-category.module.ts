import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { OutageCategoryRoutingModule } from './outage-category-routing.module';
import { OutageCategoryComponent } from './outage-category.component';
import { AddOutageCategoryComponent } from './add-outage-category/add-outage-category.component';


@NgModule({
  declarations: [OutageCategoryComponent, AddOutageCategoryComponent],
  imports: [
    CommonModule,
    OutageCategoryRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddOutageCategoryComponent
  ]
})
export class OutageCategoryModule { }
