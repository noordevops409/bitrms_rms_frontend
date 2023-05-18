import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ListingComponent } from './listing/listing.component';
import { ImgPreviewComponent } from './img-preview/img-preview.component';


@NgModule({
  declarations: [DashboardComponent, ListingComponent, ImgPreviewComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports: [
    ListingComponent,
    ImgPreviewComponent
  ]
})
export class DashboardModule { }
