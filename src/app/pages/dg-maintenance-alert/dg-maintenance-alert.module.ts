import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DgMaintenanceAlertComponent } from './dg-maintenance-alert.component';
import { SharedModule } from "../../shared/shared.module";
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        DgMaintenanceAlertComponent
    ],
    exports: [
        DgMaintenanceAlertComponent
    ],
    imports: [
        CommonModule,
        SharedModule,FormsModule
    ]
})
export class DgMaintenanceAlertModule { }
