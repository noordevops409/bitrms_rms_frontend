import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ListingComponent } from './listing/listing.component';

import { SiteDetailsComponent } from '../../shared/site-details/site-details.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'type/:id', component: ListingComponent },
  { path: 'prfdash/:siteId', component: SiteDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
