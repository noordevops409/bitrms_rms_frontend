import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEditRcaReportComponent } from '../add-edit-rca-report/add-edit-rca-report.component';

@Component({
  selector: 'app-rca-report-dialog-entry',
  templateUrl: './rca-report-dialog-entry.component.html',
  styleUrls: ['./rca-report-dialog-entry.component.scss']
})
export class RcaReportDialogEntryComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.openDialog({ id: paramMap.get('id') });
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(AddEditRcaReportComponent, {
      height: '75%',
      width: '800px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['pages', 'rca-report']);
    });
  }

}
