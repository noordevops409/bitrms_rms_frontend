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
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-add-cluster',
  templateUrl: './add-cluster.component.html',
  styleUrls: ['./add-cluster.component.scss']
})
export class AddClusterComponent implements OnInit, OnDestroy {

  public showSaving: boolean = false;
  public isSubmiting: boolean = false;
  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  public isEmployeeDDOpen: boolean = false;
  public isZoneDDOpen: boolean = false;


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
    this.initForm();
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {
    if (this.data) {
      this.isLoading = true;
    }
    this.loadZone();
    this.loadEmployee();
    setTimeout(() => {
      this.getData();
      this.isLoading = false;
    }, 1000);
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'name': [null, [Validators.required]],
      'clusterDefinition': [null, [Validators.required]],
      'acsysSyncStatusName': [null],
      'acsysSyncDateName': [null],
      'acsysSyncTimeName': [null],
      'accIdName': [null],
      'selEmployee': [null],
      'selZone': [null]
    });
  }

  loadEmployee() {
    const url = ApiConstant.getEmployeeMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.employeeMasterList && data.employeeMasterList.length) {
        this.employeeList = data.employeeMasterList;
        this.masterForm.controls['selEmployee'].setValue(data.employeeMasterList[0]);
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading employee list!'
      });
    });
  }

  setEmployee(req?: any) {
    for (let item of this.employeeList) {
      if (item.emEmpID === req.emEmployeeID) {
        this.selCluster.selEmployee = item;
        this.masterForm.controls['selEmployee'].setValue(item);
        break;
      }
    }
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
      if (item.znZoneID === req.znZoneID) {
        this.selCluster.selZone = item;
        this.masterForm.controls['selZone'].setValue(item);
        break;
      }
    }
  }

  getData() {
    if (this.data) {
      this.selCluster = this.data;
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.clusterId = this.selCluster.crClusterID;
    this.masterForm.controls['name'].setValue(this.selCluster.crName);
    this.masterForm.controls['clusterDefinition'].setValue(this.selCluster.crDefinition);
    this.masterForm.controls['acsysSyncStatusName'].setValue(this.selCluster.crAcsysSyncstatus);
    this.masterForm.controls['acsysSyncDateName'].setValue(this.selCluster.crAcsysSyncDateTime);
    this.masterForm.controls['accIdName'].setValue(this.selCluster.accID);

    this.setEmployee(this.selCluster);
    this.setZone(this.selCluster);
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
    const url = ApiConstant.saveClusterMasterData;

    // formData.acsysSyncDateName = moment(formData.acsysSyncDateName).format("YYYY-MM-DD HH:mm:ss");
    // formData.acsysSyncDateName = moment(formData.acsysSyncDateName).format("YYYY-MM-DD HH:MM:SS");
    // let acsysSyncDateTimeName = moment(formData.acsysSyncDateName + ' ' + formData.acsysSyncTimeName + ":00");
    let authToken: any = null;
    if ((window as any).localStorage.getItem('authToken')) {
      authToken = JSON.parse((window as any).localStorage.getItem('authToken'));
    }
    let params: any = {
      crName: formData.name,
      crDefinition: formData.clusterDefinition,
      rgAcsysSyncDateTime: formData.acsysSyncDateName,
      crAcsysSyncstatus: formData.acsysSyncStatusName,
      accID: parseInt(formData.accIdName, 10),
      emEmpID: formData.selEmployee.emEmpID,
      znZoneID: formData.selZone.znZoneID,
      username: "harish1"
    };

    if (this.isForEdit) {
      params.crClusterID = this.clusterId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isSaving = false;
      this.dialogRef.close(data);
      this.util.notification.success({
        title: 'Success',
        msg: 'Cluster details saved successfully...'
      });
    }, (err) => {
      this.isSaving = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving cluster details!'
      });
    });
  }

}
