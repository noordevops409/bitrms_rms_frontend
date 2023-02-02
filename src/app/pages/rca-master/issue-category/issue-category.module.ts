import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueCategoryRoutingModule } from './issue-category-routing.module';
import { IssueCategoryComponent } from './issue-category.component';
import { AddIssueComponent } from './add-issue/add-issue.component';


@NgModule({
  declarations: [IssueCategoryComponent, AddIssueComponent],
  imports: [
    CommonModule,
    IssueCategoryRoutingModule
  ],
  exports: [
    AddIssueComponent
  ]
})
export class IssueCategoryModule { }
