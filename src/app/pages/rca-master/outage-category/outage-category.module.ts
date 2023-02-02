import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutageCategoryRoutingModule } from './outage-category-routing.module';
import { OutageCategoryComponent } from './outage-category.component';
import { AddOutageCategoryComponent } from './add-outage-category/add-outage-category.component';


@NgModule({
  declarations: [OutageCategoryComponent, AddOutageCategoryComponent],
  imports: [
    CommonModule,
    OutageCategoryRoutingModule
  ],
  exports: [
    AddOutageCategoryComponent
  ]
})
export class OutageCategoryModule { }
