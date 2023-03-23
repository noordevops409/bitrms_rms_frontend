import { Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { iif, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { BroadcastService } from '../../../../shared/broadcast.service';
import { CommonUtilService } from '../../../../shared/common-util.service';
import { ApiConstant } from '../../../../shared/api-constant.enum';
import { AppConstant } from '../../../../shared/app-constant.enum';
import * as moment from 'moment';


@Component({
  selector: 'app-add-sim',
  templateUrl: './add-sim.component.html',
  styleUrls: ['./add-sim.component.scss']
})
export class AddSimComponent implements OnInit {

  public isSubmiting: boolean = false;
  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  public isZoneDDOpen: boolean = false;

  public masterForm!: FormGroup;

  public zoneList: any = null;

  private selSIM: any = null;
  private simId: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddSimComponent>,
    private formBuilder: FormBuilder
  ) { }

  get mf() {
    return (this.masterForm as any).controls;
  }

  ngOnInit(): void {
    this.init();
    this.initForm();
    this.getData();
  }

  ngOnDestroy(): void {

  }

  init() {
    if (this.data) {
      this.isLoading = true;
    }
    this.loadZone();
    setTimeout(() => {
      this.getData();
      this.isLoading = false;
    }, 1000);
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'simNumber': [null, [Validators.required]],
      'gsmOPID': [null],
      'accID': [null],
      'selZone': [null]
    });
  }

  loadZone() {
    const url = ApiConstant.getZoneMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.zoneMasterList && data.zoneMasterList.length) {
        this.zoneList = data.zoneMasterList;
        this.masterForm.controls['selZone'].setValue(data.zoneMasterList[0]);
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading zone list!'
      });
    });
  }

  setZone(req?: any) {
    for (let item of this.zoneList) {
      if (item.znZoneID === req.clCircleID) {
        this.selSIM.selZone = item;
        this.masterForm.controls['selZone'].setValue(item);
        break;
      }
    }
  }

  getData() {
    if (this.data) {
      this.selSIM = this.data;
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.simId = this.selSIM.simID;
    this.masterForm.controls['simNumber'].setValue(this.selSIM.simNumber);
    this.masterForm.controls['gsmOPID'].setValue(this.selSIM.gsmOPID);
    this.masterForm.controls['accID'].setValue(this.selSIM.acAccID);

    this.setZone(this.selSIM);
  }

  close(evt?: any) {
    this.dialogRef.close();
  }

  cancel(evt?: any) {
    this.close();
  }

  save(evt?: any) {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    const formData = this.masterForm.value;
    const url = ApiConstant.saveSimMasterData;

    let acsysSyncDateTimeName = moment(formData.acsysSyncDateName + ' ' + formData.acsysSyncTimeName);
    let authToken: any = null;
    if ((window as any).localStorage.getItem('authToken')) {
      authToken = JSON.parse((window as any).localStorage.getItem('authToken'));
    }

    let params: any = {
      simNumber: formData.simNumber,
      clCircleID: formData.selZone.znZoneID,
      gsmOPID: formData.gsmOPID,
      acAccID: formData.accID,
      username: 'harish1'
    };

    if (this.isForEdit) {
      params.simID = this.simId;
      params.simLastupdatedby = authToken.userId;
      params.simLastupdateddt = moment();
    } else {
      params.simCreatedby = authToken.userId;
      params.simCreateddt = moment();
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isSaving = false;
      this.dialogRef.close(data);
      this.util.notification.success({
        title: 'Success',
        msg: 'SIM details saved successfully...'
      });
    }, (err) => {
      this.isSaving = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving sim details!'
      });
    });
  }

}
