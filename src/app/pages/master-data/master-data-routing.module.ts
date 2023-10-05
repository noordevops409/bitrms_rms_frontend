import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterDataComponent } from './master-data.component';
import { AppConstant } from '../../shared/app-constant.enum';

const routes: Routes = [
  {
    path: '',
    component: MasterDataComponent,
    children: [
      { path: '', redirectTo: 'country', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, pathMatch: 'full' },
      { path: 'country', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, loadChildren: () => import('./country/country.module').then(m => m.CountryModule) },
      { path: 'region', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, loadChildren: () => import('./region/region.module').then(m => m.RegionModule) },
      { path: 'zone', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, loadChildren: () => import('./zone/zone.module').then(m => m.ZoneModule) },
      { path: 'employee-role', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, loadChildren: () => import('./employee-role/employee-role.module').then(m => m.EmployeeRoleModule) },
      { path: 'employee', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule) },
      { path: 'cluster', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, loadChildren: () => import('./cluster/cluster.module').then(m => m.ClusterModule) },
      { path: 'site', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, loadChildren: () => import('./site/site.module').then(m => m.SiteModule) },
      { path: 'sim', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, loadChildren: () => import('./sim/sim.module').then(m => m.SimModule) },
      { path: 'planned-energy', data: { roleIds: [AppConstant.ROUTE_ROLE_ID.ADMIN_ROLE, AppConstant.ROUTE_ROLE_ID.USER_ROLE,AppConstant.ROUTE_ROLE_ID.TEE_ROLE] }, loadChildren: () => import('./planned-energy/planned-energy.module').then(m => m.PlannedEnergyModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
