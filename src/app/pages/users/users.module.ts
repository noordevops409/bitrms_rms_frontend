import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';


@NgModule({
  declarations: [
    UsersComponent,
    AddEditUserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddEditUserComponent
  ]
})
export class UsersModule { }
