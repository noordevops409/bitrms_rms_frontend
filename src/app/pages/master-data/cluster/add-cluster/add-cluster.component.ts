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
  selector: 'app-add-cluster',
  templateUrl: './add-cluster.component.html',
  styleUrls: ['./add-cluster.component.scss']
})
export class AddClusterComponent implements OnInit, OnDestroy {

  public showSaving: boolean = false;
  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  public isEmployeeDDOpen: boolean = false;
  public isZoneDDOpen: boolean = false;

  public masterForm!: FormGroup;

  public employeeList: any = null;
  public zoneList: any = null;

  private selCluster: any = null;
  private clusterId: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddClusterComponent>,
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

  loadData() {
    this.loadEmployeeData();
    this.loadZoneData();
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'name': [null, [Validators.required]],
      'clusterDefinition': [null, [Validators.required]],
      'acsysSyncStatusName': [null],
      'acsysSyncDateName': [null],
      'acsysSyncTimeName': [null],
      'accIdName': [null],
      'selEmployee': [-1],
      'selZone': [-1],
      'selCluster': [-1]
    });
  }

  loadEmployeeData() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.employeeList = data;
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading zone list!'
      });
    });
  }

  loadZoneData() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.zoneList = data;
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading zone list!'
      });
    });
  }

  getData() {
    if (window.localStorage.getItem('selCluster')) {
      this.selCluster = JSON.parse((window as any).localStorage.getItem('selCluster'));
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.clusterId = this.selCluster.id;
    let acsysSyncDateTimeName = this.selCluster.acsysSyncDateTimeName.split(' ');
    this.masterForm.controls['name'].setValue(this.selCluster.name);
    this.masterForm.controls['clusterDefinition'].setValue(this.selCluster.clusterDefinition);
    this.masterForm.controls['acsysSyncStatusName'].setValue(this.selCluster.acsysSyncStatusName);
    this.masterForm.controls['acsysSyncDateName'].setValue(acsysSyncDateTimeName[0]);
    this.masterForm.controls['acsysSyncTimeName'].setValue(acsysSyncDateTimeName[1]);
    this.masterForm.controls['accIdName'].setValue(this.selCluster.accIdName);

    this.masterForm.controls['selEmployee'].setValue(this.selCluster.selEmployee);
    this.masterForm.controls['selZone'].setValue(this.selCluster.selZone);
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
      name: formData.name,
      clusterDefinition: formData.clusterDefinition,
      acsysSyncDateTimeName: acsysSyncDateTimeName,
      acsysSyncStatusName: formData.acsysSyncStatusName,
      accIdName: formData.accIdName,
      employeeId: formData.selEmployee.id,
      employeeName: formData.selEmployee.name,
      zoneId: formData.selZone.id,
      zoneName: formData.selZone.name
    };

    if (this.isForEdit) {
      params.id = this.clusterId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isLoading = false;
      this.util.notification.success({
        title: 'Success',
        msg: 'Cluster details saved successfully...'
      });
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving cluster details!'
      });
    });
  }

}
