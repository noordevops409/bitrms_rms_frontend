import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoogleDataStudioComponent } from './google-data-studio.component';
import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [{ path: '', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, component: GoogleDataStudioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleDataStudioRoutingModule { }
