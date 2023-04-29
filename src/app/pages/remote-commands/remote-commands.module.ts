import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RemoteCommandsRoutingModule } from './remote-commands-routing.module';
import { RemoteCommandsComponent } from './remote-commands.component';
import { ViewRemoteDataComponent } from './view-remote-data/view-remote-data.component';
import { SaveRemoteComponent } from './save-remote/save-remote.component';


@NgModule({
  declarations: [RemoteCommandsComponent, ViewRemoteDataComponent, SaveRemoteComponent],
  imports: [
    CommonModule,
    RemoteCommandsRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule, 
    FormsModule
  ],
  exports: [
    SaveRemoteComponent
  ],
  entryComponents: [
    SaveRemoteComponent
  ]
})
export class RemoteCommandsModule { }
