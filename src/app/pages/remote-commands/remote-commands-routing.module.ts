import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewRemoteDataComponent } from './view-remote-data/view-remote-data.component';
import { RemoteCommandsComponent } from './remote-commands.component';
import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [
  { path: '', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, component: RemoteCommandsComponent },
  { path: 'view/:id', data: { roleIds: [AppConstant.ROUTE_ACCESS_ID.ADMIN_ROLE,AppConstant.ROUTE_ACCESS_ID.NOC1] }, component: ViewRemoteDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemoteCommandsRoutingModule { }
