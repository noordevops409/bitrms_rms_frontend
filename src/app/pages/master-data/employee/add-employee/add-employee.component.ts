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
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit, OnDestroy {

  public showSaving: boolean = false;
  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  public isEmployeeRoleDDOpen: boolean = false;
  public isRegionDDOpen: boolean = false;
  public isZoneDDOpen: boolean = false;
  public isEscalationDDOpen: boolean = false;

  public masterForm!: FormGroup;

  public selEmployeeRole: any = null;
  public employeeRoleList: any = null;
  public selRegion: any = null;
  public regionList: any = null;
  public selZone: any = null;
  public zoneList: any = null;
  public selEscalationMode: any = null;
  public escalationModeList: any = [
    {
      label: 'Email',
      value: 1
    },
    {
      label: 'SMS',
      value: 2
    },
    {
      label: 'Both',
      value: 3
    }
  ];

  private selEmployee: any = null;
  private employeeId: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEmployeeComponent>,
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
    this.selEscalationMode = this.escalationModeList[0];
    this.loadData();
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'empId': [null, [Validators.required]],
      'firstName': [null, [Validators.required]],
      'lastName': [null, [Validators.required]],
      'name': [null, [Validators.required]],
      'contactNumber': [null],
      'email': [null],
      'erpLocation': [null],
      'employeeLocation': [null],
      'latitude': [null],
      'longitude': [null],
      'acsysEmployeeId': [null],
      'acsysEmployeeSyncStatus': [null],
      'keId': [null],
      'notification': [null],
      'accIdName': [null]
    });
  }

  loadData() {
    this.loadEmployeeRole();
    this.loadRegionData();
    this.loadZoneData();
  }

  loadEmployeeRole() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.employeeRoleList = data;
      this.setSelEmployeeRoleDD();
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading employee role list!'
      });
    });
  }

  loadZoneData() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.zoneList = data;
      this.setSelZoneDD();
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading zone list!'
      });
    });
  }

  loadRegionData() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.regionList = data;
      this.setSelRegionDD();
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading region list!'
      });
    });
  }

  getData() {
    if (window.localStorage.getItem('selEmployee')) {
      this.selEmployee = JSON.parse((window as any).localStorage.getItem('selEmployee'));
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.employeeId = this.selEmployee.id;
    this.masterForm.controls['name'].setValue(this.selEmployee.name);

    this.masterForm.controls['empId'].setValue(this.selEmployee.empId);
    this.masterForm.controls['firstName'].setValue(this.selEmployee.firstName);
    this.masterForm.controls['lastName'].setValue(this.selEmployee.lastName);
    this.masterForm.controls['contactNumber'].setValue(this.selEmployee.contactNumber);
    this.masterForm.controls['email'].setValue(this.selEmployee.email);
    this.masterForm.controls['erpLocation'].setValue(this.selEmployee.erpLocation);
    this.masterForm.controls['employeeLocation'].setValue(this.selEmployee.employeeLocation);
    this.masterForm.controls['latitude'].setValue(this.selEmployee.latitude);
    this.masterForm.controls['longitude'].setValue(this.selEmployee.longitude);
    this.masterForm.controls['acsysEmployeeId'].setValue(this.selEmployee.acsysEmployeeId);
    this.masterForm.controls['acsysEmployeeSyncStatus'].setValue(this.selEmployee.acsysEmployeeSyncStatus);
    this.masterForm.controls['keId'].setValue(this.selEmployee.keId);
    this.masterForm.controls['notification'].setValue(this.selEmployee.notification);
    this.masterForm.controls['accIdName'].setValue(this.selEmployee.accIdName);
    
    this.setEscalationMode();
  }

  setEscalationMode() {
    for (let item of this.selEscalationMode) {
      if (item.value === this.selEmployee.escalationMode) {
        this.selEscalationMode = item;
        break;
      }
    }
  }

  setSelEmployeeRoleDD() {
    for (let item of this.employeeRoleList) {
      if (item.id === this.selEmployee.roleId) {
        this.selEmployeeRole = item;
        break;
      }
    }
  }

  setSelZoneDD() {
    for (let item of this.zoneList) {
      if (item.id === this.selEmployee.zoneId) {
        this.selZone = item;
        break;
      }
    }
  }

  setSelRegionDD() {
    for (let item of this.regionList) {
      if (item.id === this.selZone.regionId) {
        this.selRegion = item;
        break;
      }
    }
  }

  toggleEmployeeRole(evt?: any) {
    this.isEmployeeRoleDDOpen = !this.isEmployeeRoleDDOpen;
  }

  selectEmployeeRole(item?: any) {
    this.selEmployeeRole = item;
  }

  toggleZone(evt?: any) {
    this.isZoneDDOpen = !this.isZoneDDOpen;
  }

  selectZone(item?: any) {
    this.selZone = item;
  }

  toggleRegion(evt?: any) {
    this.isRegionDDOpen = !this.isRegionDDOpen;
  }

  selectRegion(item?: any) {
    this.selRegion = item;
  }

  toggleEscalation(evt?: any) {
    this.isEscalationDDOpen = !this.isEscalationDDOpen;
  }

  selectEscalationMode(item?: any) {
    this.selRegion = item;
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
      roleId: this.selEmployeeRole.id,
      roleName: this.selEmployeeRole.name,
      regionId: this.selRegion.id,
      regionName: this.selRegion.name,
      zoneId: this.selZone.id,
      zoneName: this.selZone.name,
      contactNumber: formData.contactNumber,
      email: formData.email,
      erpLocation: formData.erpLocation,
      employeeLocation: formData.employeeLocation,
      latitude: formData.latitude,
      longitude: formData.longitude,
      escalationMode: this.selEscalationMode.value,
      acsysEmployeeId: formData.acsysEmployeeId,
      acsysEmployeeSyncStatus: formData.acsysEmployeeSyncStatus,
      entryDate: moment(formData.entryDate).format('YYYY-MM-DD'),
      exitDate: moment(formData.exitDate).format('YYYY-MM-DD'),
      acsysEmployeeUpdateDate: moment(formData.acsysEmployeeUpdateDate).format('YYYY-MM-DD'),
      keId: formData.keId,
      notification: formData.notification,
      accIdName: formData.accIdName
    };

    if (this.isForEdit) {
      params.id = this.employeeId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isLoading = false;
      this.util.notification.success({
        title: 'Success',
        msg: 'Employee details saved successfully...'
      });
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving employee details!'
      });
    });
  }

}
