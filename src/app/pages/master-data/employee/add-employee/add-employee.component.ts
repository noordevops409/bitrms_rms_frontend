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

  public employeeRoleList: any = null;
  public regionList: any = null;
  public zoneList: any = null;
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
    this.initForm();
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {
    if (this.data) {
      this.isLoading = true;
    }
    this.loadEmployeeRole();
    this.loadRegionData();
    this.loadZoneData();
    setTimeout(() => {
      this.getData();
      this.isLoading = false;
    }, 1000);
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'empId': [null, [Validators.required]],
      'firstName': [null, [Validators.required]],
      'lastName': [null, [Validators.required]],
      'contactNumber': [null, [Validators.required]],
      'email': [null],
      'erpLocation': [null],
      'employeeLocation': [null],
      'latitude': [null],
      'longitude': [null],
      'acsysEmployeeId': [null],
      'acsysEmployeeSyncStatus': [null],
      'keId': [null],
      'notification': [null],
      'accIdName': [null],
      'entryDate': [moment()],
      'exitDate': [moment()],
      'acsysEmployeeUpdateDate': [moment()],
      'selEmployeeRole': [null],
      'selRegion': [null],
      'selZone': [null],
      'selEscalationMode': [this.escalationModeList[0]]
    });
  }

  loadEmployeeRole() {
    const url = ApiConstant.getEmployeeRoleMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.employeeRoleMasterList && data.employeeRoleMasterList.length) {
        this.employeeRoleList = data.employeeRoleMasterList;
        this.masterForm.controls['selEmployeeRole'].setValue(data.employeeRoleMasterList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading employee role list!'
      });
    });
  }

  loadRegionData() {
    const url = ApiConstant.getRegionMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.regionMasterList && data.regionMasterList.length) {
        this.regionList = data.regionMasterList;
        this.masterForm.controls['selRegion'].setValue(data.regionMasterList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading region list!'
      });
    });
  }

  loadZoneData() {
    const url = ApiConstant.getZoneMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.zoneMasterList && data.zoneMasterList.length) {
        this.zoneList = data.zoneMasterList;
        this.masterForm.controls['selZone'].setValue(data.zoneMasterList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading zone list!'
      });
    });
  }

  getData() {
    if (this.data) {
      this.selEmployee = this.data;
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setEmployeeRole(req: any) {
    for (let item of this.employeeRoleList) {
      if (item.erRoleID === req.erRoleID) {
        this.masterForm.controls['selEmployeeRole'].setValue(item);
        break;
      }
    }
  }

  setRegion(req?: any) {
    for (let item of this.regionList) {
      if (item.rgRegionID === req.rgRegionID) {
        this.masterForm.controls['selRegion'].setValue(item);
        break;
      }
    }
  }

  setZone(req?: any) {
    for (let item of this.zoneList) {
      if (item.znZoneID === req.znZoneID) {
        this.masterForm.controls['selZone'].setValue(item);
        break;
      }
    }
  }

  setFormData() {
    this.employeeId = this.selEmployee.emEmpID;

    this.masterForm.controls['empId'].setValue(this.selEmployee.emEmployeeID);
    this.masterForm.controls['firstName'].setValue(this.selEmployee.emFirstName);
    this.masterForm.controls['lastName'].setValue(this.selEmployee.emLastName);
    this.masterForm.controls['contactNumber'].setValue(this.selEmployee.emContactNo);
    this.masterForm.controls['email'].setValue(this.selEmployee.emEmail);
    this.masterForm.controls['erpLocation'].setValue(this.selEmployee.emERPLocation);
    this.masterForm.controls['employeeLocation'].setValue(this.selEmployee.emLocation);
    this.masterForm.controls['latitude'].setValue(this.selEmployee.emLatitude);
    this.masterForm.controls['longitude'].setValue(this.selEmployee.emLongitude);
    this.masterForm.controls['acsysEmployeeId'].setValue(this.selEmployee.emAcsysEmployeeID);
    this.masterForm.controls['acsysEmployeeSyncStatus'].setValue(this.selEmployee.emAcsysEmployeeSyncstatus);
    this.masterForm.controls['keId'].setValue(this.selEmployee.keID);
    this.masterForm.controls['notification'].setValue(this.selEmployee.emNotification);
    this.masterForm.controls['accIdName'].setValue(this.selEmployee.accID);

    this.masterForm.controls['entryDate'].setValue(this.selEmployee.emEntryDate);
    this.masterForm.controls['exitDate'].setValue(this.selEmployee.emExitDate);
    this.masterForm.controls['acsysEmployeeUpdateDate'].setValue(this.selEmployee.emAcsysEmployeeUpdatedDt);

    if (this.selEmployee.selEscalationMode) {
      this.masterForm.controls['selEscalationMode'].setValue(this.selEmployee.selEscalationMode);
    } else {
      this.masterForm.controls['selEscalationMode'].setValue(this.escalationModeList[0]);
    }
    this.setEmployeeRole(this.selEmployee);
    this.setRegion(this.selEmployee);
    this.setZone(this.selEmployee);
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
    const url = ApiConstant.saveEmployeeMasterData;

    let acsysSyncDateTimeName = moment(formData.acsysSyncDateName + ' ' + formData.acsysSyncTimeName);

    let params: any = {
      emEmployeeID: formData.empId,
      emFirstName: formData.firstName,
      emLastName: formData.lastName,
      erRoleID: formData.selEmployeeRole.erRoleID,
      rgRegionID: formData.selRegion.rgRegionID,
      znZoneID: formData.selZone.znZoneID,
      emContactNo: formData.contactNumber,
      emEmail: formData.email,
      emERPLocation: formData.erpLocation,
      emLocation: formData.employeeLocation,
      emLatitude: formData.latitude,
      emLongitude: formData.longitude,
      emEscalationMode: formData.selEscalationMode.value,
      emAcsysEmployeeID: formData.acsysEmployeeId,
      emAcsysEmployeeSyncstatus: formData.acsysEmployeeSyncStatus,
      emEntryDate: moment(formData.entryDate),
      emExitDate: moment(formData.exitDate),
      emAcsysEmployeeUpdatedDt: moment(formData.acsysEmployeeUpdateDate),
      keID: formData.keId,
      emNotification: formData.notification,
      accID: formData.accIdName,
      username: "harish1",
    };

    if (this.isForEdit) {
      params.emEmpID = this.employeeId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isSaving = false;
      this.dialogRef.close(data);
      this.util.notification.success({
        title: 'Success',
        msg: 'Employee details saved successfully...'
      });
    }, (err) => {
      this.isSaving = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving employee details!'
      });
    });
  }

}
