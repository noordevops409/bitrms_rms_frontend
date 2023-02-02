import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoogleDataStudioComponent } from './google-data-studio.component';

const routes: Routes = [{ path: '', component: GoogleDataStudioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleDataStudioRoutingModule { }
