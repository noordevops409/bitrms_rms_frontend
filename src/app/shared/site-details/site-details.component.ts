import { Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { BroadcastService } from '../../shared/broadcast.service';
import { CommonUtilService } from '../../shared/common-util.service';
import { ApiConstant } from '../../shared/api-constant.enum';
import { AppConstant } from '../../shared/app-constant.enum';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss']
})
export class SiteDetailsComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;
  public selTabIndex: any = 0;
  public selTabData: any = null;
  public tabs: any = [
    {
      displayName: { name: 'Summary' },
      type: 1,
      position: 1,
      id: "nav-summary-tab",
      apiUrl: ApiConstant.getSiteSummaryData,
      param: {
        tabId: "nav-summary-tab",
        siteId: "",
        series2: "",
        series3: "",
        series4: "",
        series5: "",
        series6: "",
        series7: "",
        reportType: "Daily",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      component: 'app-sd-summary-listing'
    },
    {
      displayName: { name: 'Power Report' },
      type: 2,
      position: 2,
      id: "nav-fuel-consumption",
      apiUrl: ApiConstant.getPowerReport,
      param: {
        tabId: "nav-power-report",
        siteId: "",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      component: 'app-site-details-power-report'
    },
    {
      displayName: { name: 'Solar Energy' },
      value: 1,
      type: 3,
      position: 3,
      id: "nav-solar-tab",
      apiUrl: ApiConstant.getSiteTabSummary,
      param: {
        tabId: "nav-solar-tab",
        siteId: "",
        series2: "",
        series3: "",
        series4: "",
        series5: "",
        series6: "",
        series7: "",
        reportType: "Daily",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      kwhMap: {
        daily: "total_daily_Solar_Output_Energy",
        weekly: "total_weekly_Solar_Output_Energy",
        monthly: "total_monthly_Solar_Output_Energy",
        yearly: "total_yearly_Solar_Output_Energy",
        lifetime: "total_lifetime_Solar_Output_Energy"
      },
      component: 'app-sd-energy-listing'
    },
    {
      displayName: { name: 'Generator Energy' },
      value: 2,
      type: 4,
      position: 4,
      id: "nav-generator-tab",
      apiUrl: ApiConstant.getSiteTabSummary,
      param: {
        tabId: "nav-generator-tab",
        siteId: "",
        series2: "",
        series3: "",
        series4: "",
        series5: "",
        series6: "",
        series7: "",
        reportType: "Daily",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      kwhMap: {
        daily: "total_daily_DG_Energy",
        weekly: "total_weekly_DG_Energy",
        monthly: "total_monthly_DG_Energy",
        yearly: "total_yearly_DG_Energy",
        lifetime: "total_lifetime_DG_Energy"
      },
      component: 'app-sd-energy-listing'
    },
    {
      displayName: { name: 'DC Load' },
      value: 5,
      type: 5,
      position: 5,
      id: "nav-dc-load-tab",
      apiUrl: ApiConstant.getSiteTabSummary,
      param: {
        tabId: "nav-dc-load-tab",
        siteId: "",
        series2: "",
        series3: "",
        series4: "",
        series5: "",
        series6: "",
        series7: "",
        reportType: "Daily",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      kwhMap: {
        daily: "total_daily_Total_DCLoad_Energy_consumption",
        weekly: "total_weekly_Total_DCLoad_Energy_consumption",
        monthly: "total_monthly_Total_DCLoad_Energy_consumption",
        yearly: "total_yearly_Total_DCLoad_Energy_consumption",
        lifetime: "total_lifetime_Total_DCLoad_Energy_consumption"
      },
      component: 'app-sd-energy-listing'
    },
    {
      displayName: { name: 'AC Load' },
      value: 4,
      type: 6,
      position: 6,
      id: "nav-ac-load-tab",
      apiUrl: ApiConstant.getSiteTabSummary,
      param: {
        tabId: "nav-ac-load-tab",
        siteId: "",
        series2: "",
        series3: "",
        series4: "",
        series5: "",
        series6: "",
        series7: "",
        reportType: "Daily",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      kwhMap: {
        daily: "total_daily_TeleEnergy",
        weekly: "total_weekly_TeleEnergy",
        monthly: "total_monthly_TeleEnergy",
        yearly: "total_yearly_TeleEnergy",
        lifetime: "total_lifetime_TeleEnergy"
      },
      component: 'app-sd-energy-listing'
    },
    {
      displayName: { name: 'Battery Energy' },
      value: 12,
      type: 7,
      position: 7,
      id: "nav-battery-tab",
      apiUrl: ApiConstant.getSiteTabSummary,
      param: {
        tabId: "nav-battery-tab",
        siteId: "",
        series2: "",
        series3: "",
        series4: "",
        series5: "",
        series6: "",
        series7: "",
        reportType: "Daily",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      kwhMap: {
        daily: "total_daily_Batt_DisEnergy",
        weekly: "total_weekly_Batt_DisEnergy",
        monthly: "total_monthly_Batt_DisEnergy",
        yearly: "total_yearly_Batt_DisEnergy",
        lifetime: "total_lifetime_Batt_DisEnergy"
      },
      component: 'app-sd-energy-listing'
    },
    {
      displayName: { name: 'Inverter Energy' },
      value: 14,
      type: 8,
      position: 8,
      id: "nav-invertor-tab",
      apiUrl: ApiConstant.getSiteTabSummary,
      param: {
        tabId: "nav-invertor-tab",
        siteId: "",
        series2: "",
        series3: "",
        series4: "",
        series5: "",
        series6: "",
        series7: "",
        reportType: "Daily",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      kwhMap: {
        daily: "total_daily_InverterEnergy",
        weekly: "total_weekly_InverterEnergy",
        monthly: "total_monthly_InverterEnergy",
        yearly: "total_yearly_InverterEnergy",
        lifetime: "total_lifetime_InverterEnergy"
      },
      component: 'app-sd-energy-listing'
    },
    {
      displayName: { name: 'Event' },
      type: 9,
      position: 9,
      id: "nav-event-tab",
      apiUrl: ApiConstant.getSiteAlarmStatus,
      param: {
        tabId: "nav-event-tab",
        siteId: "",
        series2: "",
        series3: "",
        series4: "",
        series5: "",
        series6: "",
        series7: "",
        reportType: "Daily",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      component: 'app-sd-event'
    },
    {
      displayName: { name: 'Fuel Consumption' },
      type: 10,
      position: 10,
      id: "nav-fuel-consumption",
      apiUrl: ApiConstant.getSiteFuelConsumptionReport,
      param: {
        tabId: "nav-fuel-consumption",
        siteId: "",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      component: 'app-sd-fuel-consumption'
    },
    {
      displayName: { name: 'No Load Outage' },
      type: 11,
      position: 11,
      id: "nav-load-outage",
      apiUrl: ApiConstant.getSiteNoLoadOutageReport,
      param: {
        tabId: "nav-load-outage",
        siteId: "",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      component: 'app-sd-no-load-outage'
    },
    {
      displayName: { name: 'Remote' },
      type: 12,
      position: 12,
      id: "nav-remote-tab",
      apiUrl: ApiConstant.getSiteGetRemoteData,
      param: {
        tabId: "nav-remote-tab",
        siteId: "",
        series2: "",
        series3: "",
        series4: "",
        series5: "",
        series6: "",
        series7: "",
        reportType: "",
        startDate: "",
        endDate: "",
        dateMonth: "",
        dateYear: ""
      },
      component: 'app-sd-remote'
    }
  ];

  public siteData: any = null;
  public siteId: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.siteId = paramMap.get('siteId');
    });
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {
    this.loadSummary();
  }

  loadSummary() {
    // this.manipulate();
    // return;
    if (this.isLoading) {
      return;
    }
    let param: any = this.tabs[0].param;
    param.siteId = "MGT20421A" || this.siteId;
    this.isLoading = true;
    this.httpClient.post(ApiConstant.getSiteSummaryData, param).subscribe((res: any) => {
      this.isLoading = false;
      this.manipulate(res.data);
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading site summary data!'
      })
    });
  }

  manipulate(data?: any) {
    this.siteData = data;
  }

  tabChanged(evt) {
    this.selTabIndex = evt.index;
    this.selTabData = this.tabs[evt.index];
  }

  setParam() {

  }

}
