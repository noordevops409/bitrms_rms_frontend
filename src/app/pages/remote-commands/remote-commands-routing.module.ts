import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewRemoteDataComponent } from './view-remote-data/view-remote-data.component';
import { RemoteCommandsComponent } from './remote-commands.component';

const routes: Routes = [
  { path: '',  component: RemoteCommandsComponent },
  { path: 'view/:id', component: ViewRemoteDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemoteCommandsRoutingModule { }
