import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GoogleDataStudioRoutingModule } from './google-data-studio-routing.module';
import { GoogleDataStudioComponent } from './google-data-studio.component';


@NgModule({
  declarations: [GoogleDataStudioComponent],
  imports: [
    CommonModule,
    GoogleDataStudioRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class GoogleDataStudioModule { }
