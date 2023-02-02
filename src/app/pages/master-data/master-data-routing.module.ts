import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterDataComponent } from './master-data.component';

const routes: Routes = [
  { 
    path: '', 
    component: MasterDataComponent,
    children: [
      { path: '', redirectTo: 'country', pathMatch: 'full' },
      { path: 'country', loadChildren: () => import('./country/country.module').then(m => m.CountryModule) },
      { path: 'region', loadChildren: () => import('./region/region.module').then(m => m.RegionModule) }, 
      { path: 'zone', loadChildren: () => import('./zone/zone.module').then(m => m.ZoneModule) },
      { path: 'employee-role', loadChildren: () => import('./employee-role/employee-role.module').then(m => m.EmployeeRoleModule) },
      { path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule) },
      { path: 'cluster', loadChildren: () => import('./cluster/cluster.module').then(m => m.ClusterModule) },
      { path: 'site', loadChildren: () => import('./site/site.module').then(m => m.SiteModule) },
      { path: 'sim', loadChildren: () => import('./sim/sim.module').then(m => m.SimModule) },
      { path: 'planned-energy', loadChildren: () => import('./planned-energy/planned-energy.module').then(m => m.PlannedEnergyModule) },
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
