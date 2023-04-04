import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';

import { IssueCategoryRoutingModule } from './issue-category-routing.module';
import { IssueCategoryComponent } from './issue-category.component';
import { AddIssueComponent } from './add-issue/add-issue.component';


@NgModule({
  declarations: [IssueCategoryComponent, AddIssueComponent],
  imports: [
    CommonModule,
    IssueCategoryRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    AddIssueComponent
  ]
})
export class IssueCategoryModule { }
