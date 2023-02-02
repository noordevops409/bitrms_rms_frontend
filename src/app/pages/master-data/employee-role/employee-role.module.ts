import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { EmployeeRoleRoutingModule } from './employee-role-routing.module';
import { EmployeeRoleComponent } from './employee-role.component';
import { AddEmployeeRoleComponent } from './add-employee-role/add-employee-role.component';


@NgModule({
  declarations: [EmployeeRoleComponent, AddEmployeeRoleComponent],
  imports: [
    CommonModule,
    EmployeeRoleRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddEmployeeRoleComponent
  ]
})
export class EmployeeRoleModule { }
