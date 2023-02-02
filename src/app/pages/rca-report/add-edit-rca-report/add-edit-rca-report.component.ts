import { Component, OnInit, OnDestroy, Inject, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { CommonUtilService } from '../../../shared/common-util.service';
import { BroadcastService } from '../../../shared/broadcast.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';


import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';

import * as moment from 'moment';
import { analytics_v3 } from 'googleapis';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-add-edit-rca-report',
  templateUrl: './add-edit-rca-report.component.html',
  styleUrls: ['./add-edit-rca-report.component.scss']
})
export class AddEditRcaReportComponent implements OnInit, OnDestroy {


  @Input() isForEdit = false;
  @Input() selectedRow: any = null;

  @ViewChild('element', { static: true }) $element: any;

  @Output() onAddSuccess: EventEmitter<any> = new EventEmitter<any>();

  @Output() onUpdateSuccess: EventEmitter<any> = new EventEmitter<any>();

  public isValid = false;
  public isSubmiting = false;
  public jobForm!: FormGroup;


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

  private ddFieldSourceData: any = ['regionData', 'faultData', 'issueData', 'outageData'];
  private ddFields: any = ['selCharityData', 'selOrgData', 'selFinYearData', 'selPaymentMode'];
  private ddFieldValue: any = ['charityid', 'orgid', 'finyearid', 'modeofpay'];
  private impFieldList: any = ['selectDate', 'selectSiteName', 'selectRegionName', 'enterAnchorOprtr', 'enterOpcoID', 'inputSiteDownTime', 'inputRestoredTime'];
  private noObjList: any = ['selectDate', 'selectRegionName', 'inputSiteDownTime', 'inputRestoredTime', 'selectIssueName', 'selectOutageCategory', 'selectFaultCategory', 'createdate', 'remarks', 'createdby'];
  private isPanelOpen = false;
  private paramObj: any = {};
  private $: any = window['jQuery'];
  private ddName = '';
  private srno: any = 0;
  private editSub!: Subscription;
  private editSub1!: Subscription;
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
    return this.jobForm.controls;
  }

  ngOnInit(): void {
    this.init();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.editSub.unsubscribe();
  }

  listen() {
    this.editSub = this.broadcast.on<string>('SET_SELECTED_ROW_FOR_EDIT_RCA_REPORT').subscribe((data: any) => {
      this.selectedRow = data;
    });
  }

  init() {
    moment.locale("en");
    this.rcaReportId = this.data ? this.data.id : null;
    if (this.rcaReportId) {
      this.isForEdit = true;
      this.getRCAData();
    } else {
      this.isForEdit = false;
      this.loadDDData();
    }
  }

  loadDDData() {
    this.loadSiteName();
    this.loadRegionData();
    this.loadFaultCategory();
    this.loadIssueCategory();
    this.loadOutageCategory();
  }

  initForm() {
    this.jobForm = this.formBuilder.group({
      'selectDate': [null],
      'inputSiteDownTime': [null],
      'inputRestoredTime': [null],
      'selectRegionName': [null],
      'selectSiteName': [null],
      'enterAnchorOprtr': [null],
      'selectIssueName': [null],
      'selectOutageCategory': [null],
      'selectFaultCategory': [null],
      'enterRCA': [null],
      'enterOutageMinutes': [null],
      'enterSLA': [null],
      'enterOpcoID': [null],
      'siteDownDuration': [null]
    });
  }

  getRCAData() {
    let apiUrl: any = ApiConstant.getRCADetails + `?rcaidLong=${this.rcaReportId}`;
    this.httpClient.post(apiUrl, {}).subscribe((res?: any) => {
      console.log(res.data);
      this.setFormData(res.data);
      this.loadDDData();
    }, (err) => {

    });
  }

  setFormData(data) {
    this.selRcaDetails = data;

    this.jobForm.controls['selectDate'].setValue(this.selRcaDetails.rcaDate);
    this.jobForm.controls['inputSiteDownTime'].setValue(this.selRcaDetails.siteDownTime);
    this.jobForm.controls['inputRestoredTime'].setValue(this.selRcaDetails.restoredTime);
    this.calDuration();

    this.jobForm.controls['enterAnchorOprtr'].setValue(this.selRcaDetails.anchorOprtr);
    this.jobForm.controls['enterOutageMinutes'].setValue(this.selRcaDetails.outageInMinutes);
    this.jobForm.controls['enterRCA'].setValue(this.selRcaDetails.rca);
    this.jobForm.controls['enterSLA'].setValue(this.selRcaDetails.sla);
    this.jobForm.controls['enterOpcoID'].setValue(this.selRcaDetails.opcoID);
  }

  loadSiteName() {
    const url = ApiConstant.getLatestData;
    this.httpClient.get(url).subscribe((res: any) => {
      this.siteList = res.data;
      let selData: any = null;
      if (this.selRcaDetails) {
        let smSiteID: any = this.selRcaDetails.smSitecode || this.selRcaDetails.smSiteID;
        for (let item of this.siteList) {
          if (item.smSitecode === smSiteID) {
            selData = item;
            break;
          }
        }
      }
      if (selData) {
        this.jobForm.controls['selectSiteName'].setValue(selData);
      } else {
        this.jobForm.controls['selectSiteName'].setValue(this.siteList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading Tower Latest Details!'
      })
    });
  }

  loadRegionData() {
    this.httpClient.get(ApiConstant.getRegionMaster, {}).subscribe((res?: any) => {
      this.regionData = res.data.filter((item) => {
        return item.rgRegion
      });
      let selData: any = null;
      if (this.selRcaDetails && this.selRcaDetails.rgRegionID) {
        for (let item of this.regionData) {
          if (item.rgRegionID === this.selRcaDetails.rgRegionID) {
            selData = item;
            break;
          }
        }
      }
      if (selData) {
        this.jobForm.controls['selectRegionName'].setValue(selData);
      } else {
        this.jobForm.controls['selectRegionName'].setValue(this.regionData[0]);
      }
    }, (err) => {

    });
  }

  loadFaultCategory() {
    this.httpClient.post(ApiConstant.getFaultCategory, {}).subscribe((data?: any) => {
      this.faultData = data.faultCategoryMasterList.filter((item) => {
        return item.faultCategory;
      });
      let selData: any = null;
      if (this.selRcaDetails && this.selRcaDetails.faultID) {
        for (let item of this.faultData) {
          if (item.faultID === this.selRcaDetails.faultID) {
            selData = item;
            break;
          }
        }
      }
      if (selData) {
        this.jobForm.controls['selectFaultCategory'].setValue(selData);
      } else {
        this.jobForm.controls['selectFaultCategory'].setValue(this.faultData[0]);
      }
    }, (err) => {

    });
  }

  loadIssueCategory() {
    this.httpClient.post(ApiConstant.getIssueCategory, {}).subscribe((data?: any) => {
      this.issueData = data.issueCategoryMasterList.filter((item) => {
        return item.issuename
      });
      let selData: any = null;
      if (this.selRcaDetails && this.selRcaDetails.issueCatID) {
        for (let item of this.issueData) {
          if (item.issueCatID === this.selRcaDetails.issueCatID) {
            selData = item;
            break;
          }
        }
      }
      if (selData) {
        this.jobForm.controls['selectIssueName'].setValue(selData);
      } else {
        this.jobForm.controls['selectIssueName'].setValue(this.issueData[0]);
      }
    }, (err) => {

    });
  }

  loadOutageCategory() {
    this.httpClient.post(ApiConstant.getOutageCategory, {}).subscribe((data?: any) => {
      this.outageData = data.outageCategoryMasterList.filter((item) => {
        return item.outageCategory;
      });
      let selData: any = null;
      if (this.selRcaDetails && this.selRcaDetails.outageCatID) {
        for (let item of this.outageData) {
          if (item.outageCatID === this.selRcaDetails.outageCatID) {
            selData = item;
            break;
          }
        }
      }
      if (selData) {
        this.jobForm.controls['selectOutageCategory'].setValue(selData);
      } else {
        this.jobForm.controls['selectOutageCategory'].setValue(this.outageData[0]);
      }
    }, (err) => {

    });
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
    let formData: any = this.jobForm.value;
    // formData.inputSiteDownTime = moment(new Date(formData.inputSiteDownTime));
    // formData.inputRestoredTime = moment(new Date(formData.inputRestoredTime));
    let downTime: any = moment(new Date(formData.inputSiteDownTime), "HH:mm:ss");
    let restoreTime: any = moment(new Date(formData.inputRestoredTime), "HH:mm:ss");
    let diff: any = moment.utc(restoreTime.diff(downTime, "minutes"));
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
    this.jobForm.controls['siteDownDuration'].setValue(format);
  }

  reset() {
    this.isSubmiting = false;
    this.jobForm.reset();
  }


  submitData(opt?: any) {
    if (this.isSubmiting) {
      return;
    }

    let formData: any = this.jobForm.value;
    this.calDuration();

    let paramObj: any = {
      "rcaDate": moment(formData.selectDate),
      "siteDownTime": moment(formData.inputSiteDownTime),
      "restoredTime": moment(formData.inputRestoredTime),
      "faultID": formData.selectFaultCategory.faultID,
      "faultCategory": formData.selectFaultCategory.faultCategory,
      "outageCatID": formData.selectOutageCategory.outageCatID,
      "outageCategory": formData.selectOutageCategory.outageCategory,
      "rcaid": this.rcaReportId,
      "anchorOprtr": formData.enterAnchorOprtr,
      "opcoId": formData.enterOpcoID,
      "rgRegionID": formData.selectRegionName.rgRegionID,
      "znZoneID": 1,
      "rgRegion": formData.selectRegionName.rgRegion,
      "rgAcsysSyncstatus": 1,
      "rgAcsysSyncDateTime": 1,
      "accID": 1,
      "smSiteID": 1,
      "smSitecode": formData.selectSiteName.smSiteCode,
      "smSitename": formData.selectSiteName.siteName,
      "issueCatID": formData.selectIssueName.issueCatID,
      "issuename": formData.selectIssueName.issuename,
      "siteDownDuration": formData.siteDownDuration,
      "rca": formData.enterRCA,
      "outageInMinutes": formData.enterOutageMinutes,
      "sla": formData.enterSLA,
      "dummyVar": ""
    }

    this.isSubmiting = true;
    this.httpClient.post(ApiConstant.saveRCADetails, paramObj).subscribe((data) => {
      this.isSubmiting = false;
      if (this.isForEdit) {
        this.updateListingRow(data);
      } else {
        this.addNewDataInListing(data);
      }
      this.util.notification.success({
        title: 'Success',
        msg: 'RCA Details Saved Successfully.'
      });
      if (opt && opt.isReqToKeepOpen) {
        this.reset();
      } else {
        this.close();
      }
    }, (err) => {
      this.isSubmiting = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving RCA details!'
      });
    });
  }

  updateListingRow(data) {
    this.onUpdateSuccess.emit(data);
  }

  addNewDataInListing(data) {
    if (data && data.data) {
      this.onAddSuccess.emit({});
    }
  }

  setFocus(evt, targetElemId) {
    if (document.getElementById(targetElemId)) {
      (document.getElementById(targetElemId) as any).focus();
    }
  }

  close() {
    this.reset();
    this.dialogRef.close();
  }

  save() {
    if (this.jobForm.valid) {
      this.submitData();
    }
  }
}
