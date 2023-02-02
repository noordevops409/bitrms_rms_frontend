import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RemoteCommandsRoutingModule } from './remote-commands-routing.module';
import { RemoteCommandsComponent } from './remote-commands.component';


@NgModule({
  declarations: [RemoteCommandsComponent],
  imports: [
    CommonModule,
    RemoteCommandsRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class RemoteCommandsModule { }
