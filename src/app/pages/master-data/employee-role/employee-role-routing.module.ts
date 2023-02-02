import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeRoleComponent } from './employee-role.component';

const routes: Routes = [{ path: '', component: EmployeeRoleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoleRoutingModule { }
