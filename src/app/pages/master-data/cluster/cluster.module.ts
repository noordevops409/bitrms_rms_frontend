import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { ClusterRoutingModule } from './cluster-routing.module';
import { ClusterComponent } from './cluster.component';
import { AddClusterComponent } from './add-cluster/add-cluster.component';


@NgModule({
  declarations: [ClusterComponent, AddClusterComponent],
  imports: [
    CommonModule,
    ClusterRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ]
})
export class ClusterModule { }
