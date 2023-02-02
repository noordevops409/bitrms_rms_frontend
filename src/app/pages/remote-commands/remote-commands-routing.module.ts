import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemoteCommandsComponent } from './remote-commands.component';

const routes: Routes = [{ path: '', component: RemoteCommandsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemoteCommandsRoutingModule { }
