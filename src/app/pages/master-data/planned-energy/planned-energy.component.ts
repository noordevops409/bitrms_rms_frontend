import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CommonUtilService } from '../../../shared/common-util.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';
import { BroadcastService } from '../../../shared/broadcast.service';

import { AddPlannedEnergyComponent } from './add-planned-energy/add-planned-energy.component';

@Component({
  selector: 'app-planned-energy',
  templateUrl: './planned-energy.component.html',
  styleUrls: ['./planned-energy.component.scss']
})
export class PlannedEnergyComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;
  public allItems: any = [];
  public dataSource: any = [];
  public searchText: any = null;
  public isListServerError: boolean = false;
  public showSaving: boolean = false;

  public totalItemCount: number = 0;
  public pageSize: number = 5;
  public pageIndex: number = 0;
  public paginationLoading = false;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {

  }

  loadData() {

  }

  manipulate() {

  }

  searchKey(data: string) {
    this.searchText = data;
    this.searchNameFilter();
  }

  searchNameFilter() {
    this.dataSource = this.allItems.filter(item => item.name.toLowerCase().includes(this.searchText.toLowerCase()) == true);
  }

  exportExcel(evt?: any) {

  }

  exportCSV(evt?: any) {

  }

  onPaginationChange($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.loadData();
  }

  add(evt?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddPlannedEnergyComponent, {
      width: '1000px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {

      }
    });
  }

  edit(evt?: any, item?: any) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(AddPlannedEnergyComponent, {
      width: '1000px',
      height: 'auto',
      data: item
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {

      }
    });
  }

  delete(item?: any, i?: any) {

  }

}
