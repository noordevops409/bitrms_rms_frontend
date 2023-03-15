import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { SiteRoutingModule } from './site-routing.module';
import { SiteComponent } from './site.component';
import { AddSiteComponent } from './add-site/add-site.component';
import { FilterSiteComponent } from './filter-site/filter-site.component';


@NgModule({
  declarations: [SiteComponent, AddSiteComponent, FilterSiteComponent],
  imports: [
    CommonModule,
    SiteRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddSiteComponent,
    FilterSiteComponent
  ]
})
export class SiteModule { }
