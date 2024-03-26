import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [{ path: '', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, component: UsersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
