import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerReportComponent } from './power-report.component';

const routes: Routes = [{ path: '', component: PowerReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PowerReportRoutingModule { }
