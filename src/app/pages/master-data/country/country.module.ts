import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { CountryRoutingModule } from './country-routing.module';
import { CountryComponent } from './country.component';
import { AddCountryComponent } from './add-country/add-country.component';


@NgModule({
  declarations: [CountryComponent, AddCountryComponent],
  imports: [
    CommonModule,
    CountryRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddCountryComponent
  ]
})
export class CountryModule { }
