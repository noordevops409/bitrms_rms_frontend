import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from "@angular/router";

import { CommonUtilService } from '../shared/common-util.service';
import { AppConstant } from '../shared/app-constant.enum';
import { ApiConstant } from '../shared/api-constant.enum';

import { BroadcastService } from './broadcast.service';

@Injectable({
  providedIn: 'root'
})
export class ListingApiService {

  retainNoOfShow: number = (window as any)['retainNoOfShow'] || 10;
  lazyLoadBatchSize: number = this.retainNoOfShow;

  private $: any = (window as any)['$'];

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private router: Router
  ) { }

  removeSelected_Assoc(array: any, el: any, index: any, callback: any) {
    if (!array) {
      return;
    }

    if (el === 'all') {
      array.length = 0;
    } else {
      el.closest('.repeated-item').remove();
      // tslint:disable-next-line: no-unused-expression
      array && array.splice(index, 1);
    }

    // tslint:disable-next-line: no-unused-expression
    callback && callback(array, el, index);
  }

  getColumnDataByFieldName(columns: any, fieldName: any) {
    if (!columns || !columns.length) {
      return {};
    }
    const filtered = columns.filter((val: any) => {
      return val.fieldName === fieldName;
    });
    if (!filtered.length) {
      return {};
    }
    return filtered[0];
  }

  viewSiteDetails(data: any) {
    this.router.navigate(['pages', 'dashboard', 'prfdash', data.smSiteCode]);
  }

  viewAlarmCategory(data: any) {
    this.router.navigate(['pages', 'dashboard', 'alarm-status', data.smSiteCode]);
  }

  viewHourlyReport(data: any) {
    this.router.navigate(['pages', 'dashboard', 'hourly-report', data.smSiteCode]);
  }

  loadSiteDetails(data: any) {
    data.isForViewDetails = false;
    data.isForLoadOtherDetails = true;
    this.broadcast.broadcast('SET_SELECTED_ROW', data);
  }

  editRCAReportDetails(data: any) {
    this.broadcast.broadcast('OPEN_RCA_REPORT_FOR_EDIT', data);
  }

  deleteRCAReportDetails(data: any) {
    this.broadcast.broadcast('OPEN_RCA_REPORT_FOR_DELETE', data);
  }

  openCountryDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_COUNTRY_FOR_EDIT', data);
  }

  openCountryDataForDelete(data: any) {
    this.broadcast.broadcast('OPEN_COUNTRY_FOR_DELETE', data);
  }

  openRegionDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_REGION_FOR_EDIT', data);
  }

  openRegionDataForDelete(data: any) {
    this.broadcast.broadcast('OPEN_REGION_FOR_DELETE', data);
  }

  openZoneDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_ZONE_FOR_EDIT', data);
  }

  openZoneDataForDelete(data: any) {
    this.broadcast.broadcast('OPEN_ZONE_FOR_DELETE', data);
  }

  openEmployeeDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_EMPLOYEE_FOR_EDIT', data);
  }

  openEmployeeDataForDelete(data: any) {
    this.broadcast.broadcast('OPEN_EMPLOYEE_FOR_DELETE', data);
  }

  openEmployeeRoleDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_EMPLOYEE_ROLE_FOR_EDIT', data);
  }

  openEmployeeRoleDataForDelete(data: any) {
    this.broadcast.broadcast('OPEN_EMPLOYEE_ROLE_FOR_DELETE', data);
  }

  openPlannedEnergyDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_PLANNED_ENERGY_FOR_EDIT', data);
  }

  openPlannedEnergyDataForDelete(data: any) {
    this.broadcast.broadcast('OPEN_PLANNED_ENERGY_FOR_DELETE', data);
  }

  openSiteMasterDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_SITE_MASTER_FOR_EDIT', data);
  }

  openSiteMasterDataForDelete(data: any) {
    this.broadcast.broadcast('OPEN_SITE_MASTER_FOR_DELETE', data);
  }

  openClusterDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_CLUSTER_FOR_EDIT', data);
  }

  openClusterDataForDelete(data: any) {
    this.broadcast.broadcast('OPEN_CLUSTER_FOR_DELETE', data);
  }

  openSimDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_SIM_FOR_EDIT', data);
  }

  openSimDataForDelete(data: any) {
    this.broadcast.broadcast('OPEN_SIM_FOR_DELETE', data);
  }

  openIssueCategoryDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_ISSUE_CATEGORY_FOR_EDIT', data);
  }

  openIssueCategoryForDelete(data: any) {
    this.broadcast.broadcast('OPEN_ISSUE_CATEGORY_FOR_DELETE', data);
  }

  openOutageCategoryDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_OUTAGE_CATEGORY_FOR_EDIT', data);
  }

  openOutageCategoryForDelete(data: any) {
    this.broadcast.broadcast('OPEN_OUTAGE_CATEGORY_FOR_DELETE', data);
  }

  openFaultCategoryDataForEdit(data: any) {
    this.broadcast.broadcast('OPEN_FAULT_CATEGORY_FOR_EDIT', data);
  }

  openFaultCategoryForDelete(data: any) {
    this.broadcast.broadcast('OPEN_FAULT_CATEGORY_FOR_DELETE', data);
  }
}
