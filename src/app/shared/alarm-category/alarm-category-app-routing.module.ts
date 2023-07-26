import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AlarmCategoryComponent } from './alarm-category.component';
import { AlertsTableComponent } from './alerts-table/alerts-table.component';
import { PagesComponent } from 'src/app/pages/pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'alarm-status', loadChildren: () => import('./alarm-category.component').then(m => m.AlarmCategoryComponent) },
      ]
    }
  
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AlarmCategoryAppRoutingModule { }
