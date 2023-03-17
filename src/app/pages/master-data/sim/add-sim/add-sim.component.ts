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
    this.loadData();
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'simNumber': [null, [Validators.required]],
      'gsmOPID': [null],
      'accID': [null],
      'selZone': [null]
    });
  }

  loadData() {
    this.loadZoneData();
  }

  loadZoneData() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.zoneList = data;
      this.masterForm.controls['selZone'].setValue(data[0]);
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading zone list!'
      });
    });
  }

  getData() {
    if (window.localStorage.getItem('selSim')) {
      this.selSIM = JSON.parse((window as any).localStorage.getItem('selSim'));
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.simId = this.selSIM.id;

    this.masterForm.controls['simNumber'].setValue(this.selSIM.simNumber);
    this.masterForm.controls['gsmOPID'].setValue(this.selSIM.gsmOPID);
    this.masterForm.controls['accID'].setValue(this.selSIM.accID);
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
    const url = "";

    let acsysSyncDateTimeName = moment(formData.acsysSyncDateName + ' ' + formData.acsysSyncTimeName);

    let params: any = {
      empId: formData.empId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      zoneId: formData.selZone.id,
      zoneName: formData.selZone.name,
      gsmOPID: formData.gsmOPID,
      accID: formData.accID
    };

    if (this.isForEdit) {
      params.id = this.simId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isLoading = false;
      this.util.notification.success({
        title: 'Success',
        msg: 'SIM details saved successfully...'
      });
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving sim details!'
      });
    });
  }

}
