import { Component, OnInit, OnDestroy, Inject, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';

import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';

import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-add-edit-rca-report',
  templateUrl: './add-edit-rca-report.component.html',
  styleUrls: ['./add-edit-rca-report.component.scss']
})
export class AddEditRcaReportComponent implements OnInit, OnDestroy {

  public showSaving: boolean = false;
  public isSubmiting: boolean = false;
  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  public isValid = false;

  public masterForm!: FormGroup;

  public date!: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate!: moment.Moment;
  public maxDate!: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public disableMinute = 0;
  public hideTime = 0;
  public color: ThemePalette = 'primary';


  public siteList: any = [];
  public regionData: any = [];
  public faultData: any = [];
  public issueData: any = [];
  public outageData: any = [];

  private rcaReportId: any = null;
  private selRcaDetails: any = null;

  constructor(
    public dialogRef: MatDialogRef<AddEditRcaReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  get jf() {
    return this.masterForm.controls;
  }

  ngOnInit(): void {
    moment.locale("en");
    this.initForm();
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {
    this.loadData();
    setTimeout(() => {
      this.getData();
    }, 1000);
  }

  loadData() {
    this.loadSiteList();
    this.loadRegion();
    this.loadFaultCategory();
    this.loadIssueCategory();
    this.loadOutageCategory();
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'selectDate': [null],
      'inputSiteDownTime': [null],
      'inputRestoredTime': [null],
      'enterAnchorOprtr': [null],
      'enterRCA': [null],
      'enterOutageMinutes': [null],
      'enterSLA': [null],
      'enterOpcoID': [null],
      'siteDownDuration': [null],
      'selectRegionName': [null],
      'selectSiteName': [null],
      'selectIssueName': [null],
      'selectOutageCategory': [null],
      'selectFaultCategory': [null]
    });
  }

  setFocus(evt, targetElemId) {
    if (document.getElementById(targetElemId)) {
      (document.getElementById(targetElemId) as any).focus();
    }
  }

  getData() {
    if (this.data) {
      this.selRcaDetails = this.data;
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.rcaReportId = this.selRcaDetails.rcaid;
    this.masterForm.controls['selectDate'].setValue(this.selRcaDetails.rcaDate);
    this.masterForm.controls['inputSiteDownTime'].setValue(this.selRcaDetails.siteDownTime);
    this.masterForm.controls['inputRestoredTime'].setValue(this.selRcaDetails.restoredTime);
    this.calDuration();

    this.masterForm.controls['enterAnchorOprtr'].setValue(this.selRcaDetails.anchorOprtr);
    this.masterForm.controls['enterOutageMinutes'].setValue(this.selRcaDetails.outageInMinutes);
    this.masterForm.controls['enterRCA'].setValue(this.selRcaDetails.rca);
    this.masterForm.controls['enterSLA'].setValue(this.selRcaDetails.sla);
    this.masterForm.controls['enterOpcoID'].setValue(this.selRcaDetails.opcoID);

    this.setSiteData(this.selRcaDetails);
    this.setRegionData(this.selRcaDetails);
    this.setFaultCategory(this.selRcaDetails);
    this.setIssueCategory(this.selRcaDetails);
    this.setOutageCategory(this.selRcaDetails);
  }

  loadSiteList() {
    let apiUrl: any = ApiConstant.getSiteMasterData;
    // (window as any)['retainNoOfShow'] = this.pageSize;
    this.httpClient.post(apiUrl, null).subscribe((res: any) => {
      if (res && res.siteMasterList && res.siteMasterList.length) {
        this.siteList = res.siteMasterList;
        this.masterForm.controls['selectSiteName'].setValue(res.siteMasterList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading site details!'
      })
    });
  }

  setSiteData(req: any) {
    for (let item of this.siteList) {
      if (item.smSiteID === req.smSiteID) {
        this.masterForm.controls['selectSiteName'].setValue(item);
        break;
      }
    }
  }

  loadRegion() {
    let apiUrl: any = ApiConstant.getRegionMasterData;
    this.httpClient.post(apiUrl, null).subscribe((res: any) => {
      if (res && res.regionMasterList && res.regionMasterList.length) {
        this.regionData = res.regionMasterList;
        this.masterForm.controls['selectRegionName'].setValue(res.regionMasterList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading region details!'
      })
    });
  }

  setRegionData(req: any) {
    for (let item of this.regionData) {
      if (item.rgRegionID === req.rgRegionID) {
        this.masterForm.controls['selectRegionName'].setValue(item);
        break;
      }
    }
  }

  loadFaultCategory() {
    let apiUrl: any = ApiConstant.getFaultCategoryData;
    this.httpClient.post(apiUrl, null).subscribe((res: any) => {
      if (res && res.faultCategoryMasterList && res.faultCategoryMasterList.length) {
        this.faultData = res.faultCategoryMasterList;
        this.masterForm.controls['selectFaultCategory'].setValue(res.faultCategoryMasterList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading fault category details!'
      })
    });
  }

  setFaultCategory(req: any) {
    for (let item of this.faultData) {
      if (item.faultID === req.faultID) {
        this.masterForm.controls['selectFaultCategory'].setValue(item);
        break;
      }
    }
  }

  loadIssueCategory() {
    let apiUrl: any = ApiConstant.getIssueCategoryData;
    this.httpClient.post(apiUrl, null).subscribe((res: any) => {
      if (res && res.issueCategoryMasterList && res.issueCategoryMasterList.length) {
        this.issueData = res.issueCategoryMasterList;
        this.masterForm.controls['selectIssueName'].setValue(res.issueCategoryMasterList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading issue category details!'
      })
    });
  }

  setIssueCategory(req: any) {
    for (let item of this.issueData) {
      if (item.issueCatID === req.issueCatID) {
        this.masterForm.controls['selectIssueName'].setValue(item);
        break;
      }
    }
  }

  loadOutageCategory() {
    let apiUrl: any = ApiConstant.getOutageCategoryData;
    this.httpClient.post(apiUrl, null).subscribe((res: any) => {
      if (res && res.outageCategoryMasterList && res.outageCategoryMasterList.length) {
        this.outageData = res.outageCategoryMasterList;
        this.masterForm.controls['selectOutageCategory'].setValue(res.outageCategoryMasterList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading outage category details!'
      })
    });
  }

  setOutageCategory(req) {
    for (let item of this.outageData) {
      if (item.outageCatID === req.outageCatID) {
        this.masterForm.controls['selectOutageCategory'].setValue(item);
        break;
      }
    }
  }

  splitTime(numberOfMinutes) {
    let hours: any = Math.floor(numberOfMinutes / 60);
    let days: any = Math.floor(hours / 24);
    if (hours > 24) {
      hours = Math.floor(hours % 24);
    }
    let minutes: any = Math.floor(numberOfMinutes % 60);
    return ({ "days": days, "hours": hours, "minutes": minutes })
  }

  calDuration(evt?: any) {
    let formData: any = this.masterForm.value;
    // formData.inputSiteDownTime = moment(new Date(formData.inputSiteDownTime));
    // formData.inputRestoredTime = moment(new Date(formData.inputRestoredTime));
    let downTime: any = moment(new Date(formData.inputSiteDownTime), "HH:mm:ss");
    let restoreTime: any = moment(new Date(formData.inputRestoredTime), "HH:mm:ss");
    let diffInMinutes = restoreTime.diff(downTime, "minutes");
    let diff: any = moment.utc(diffInMinutes);
    if (diffInMinutes > 0) {
      this.masterForm.controls['enterOutageMinutes'].setValue(diffInMinutes);
      this.masterForm.controls['enterSLA'].setValue((1 - (diffInMinutes / 1440)) * 100);
    }
    let convert: any = this.splitTime(diff);
    let format: any = "";
    if (convert.days > 0) {
      format += convert.days + ' days ';
    }
    if (convert.hours > 0) {
      format += convert.hours <= 9 ? "0" + convert.hours + ":" : convert.hours + ":";
    }

    if (convert.minutes > 0) {
      format += convert.minutes <= 9 ? "0" + convert.minutes + ":" : convert.minutes + ":";
    }
    format += "00";
    // let formatted: any = moment.utc(convert.asMilliseconds()).format("D[ days] HH:mm:ss");
    this.masterForm.controls['siteDownDuration'].setValue(format);
  }

  reset() {
    this.isSubmiting = false;
    this.masterForm.reset();
  }

  close(evt?: any) {
    this.dialogRef.close();
  }

  cancel(evt?: any) {
    this.close();
  }


  save(opt?: any) {
    if (this.isSaving) {
      return;
    }

    let formData: any = this.masterForm.value;
    const url = ApiConstant.saveRCADetails;
    this.calDuration();

    let authToken: any = null;
    if ((window as any).localStorage.getItem('authToken')) {
      authToken = JSON.parse((window as any).localStorage.getItem('authToken'));
    }

    let paramObj: any = {
      "rcaDate": formData.selectDate,
      "siteDownTime": formData.inputSiteDownTime,
      "restoredTime": formData.inputRestoredTime,
      "faultID": formData.selectFaultCategory.faultID,
      "faultCategory": formData.selectFaultCategory.faultCategory,
      "outageCatID": formData.selectOutageCategory.outageCatID,
      "outageCategory": formData.selectOutageCategory.outageCategory,
      "rcaid": this.rcaReportId,
      "anchorOprtr": formData.enterAnchorOprtr,
      "opcoId": formData.enterOpcoID,
      "rgRegionID": formData.selectRegionName.rgRegionID,
      "rgRegion": formData.selectRegionName.rgRegion,
      "znZoneID": 0,
      "rgAcsysSyncstatus": 0,
      "rgAcsysSyncDateTime": 0,
      "accID": 0,
      "smSiteID": formData.selectSiteName.smSiteID,
      "smSitecode": formData.selectSiteName.smSitecode,
      "smSitename": formData.selectSiteName.smSitename,
      "issueCatID": formData.selectIssueName.issueCatID,
      "issuename": formData.selectIssueName.issuename,
      "siteDownDuration": formData.siteDownDuration,
      "rca": formData.enterRCA,
      "outageInMinutes": formData.enterOutageMinutes,
      "sla": formData.enterSLA,
      "dummyVar": ""
    }

    if (this.isForEdit) {
      paramObj.rcaid = this.rcaReportId;
    }

    this.isSaving = true;
    this.httpClient.post(url, paramObj).subscribe((data) => {
      this.isSaving = false;
      this.dialogRef.close(data);
      this.util.notification.success({
        title: 'Success',
        msg: 'RCA Details Saved Successfully.'
      });
    }, (err) => {
      this.isSaving = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving RCA details!'
      });
    });
  }


}
