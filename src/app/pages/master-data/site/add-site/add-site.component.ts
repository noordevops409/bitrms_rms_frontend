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
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.scss']
})
export class AddSiteComponent implements OnInit, OnDestroy {

  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  public isSiteTypeDDOpen: boolean = false;
  public isClusterDDOpen: boolean = false;
  public isEmployeeDDOpen: boolean = false;
  public isDeviceTypeDDOpen: boolean = false;
  public isSimDDOpen: boolean = false;
  public isSiteStatusDDOpen: boolean = false;
  public isCustomerDDOpen: boolean = false;
  public isSiteClassificationDDOpen: boolean = false;

  public selSiteType: any = null;
  public siteTypeList: any = [
    {
      value: 'Hybrid',
      label: 'Hybrid'
    },
    {
      value: 'TEE',
      label: 'TEE'
    }
  ];
  public selDeviceType: any = null;
  public deviceTypeList: any = [
    {
      value: 'Lineage',
      label: 'Lineage'
    },
    {
      value: 'Li-Lithium',
      label: 'Li-Lithium'
    },
    {
      value: 'Statcon',
      label: 'Statcon'
    },
    {
      value: 'Delta',
      label: 'Delta'
    },
    {
      value: 'Alpha',
      label: 'Alpha'
    }
  ];
  public selSiteStatus: any = null;
  public siteStatusList: any = [
    {
      label: 'Active',
      value: 'Active'
    },
    {
      label: 'Inactive',
      value: 'Inactive'
    }
  ];
  public selCustomer: any = null;
  public customerList: any = [
    {
      label: 'Apollo',
      value: 'Apollo'
    },
    {
      label: 'IGT',
      value: 'IGT'
    },
    {
      label: 'Community',
      value: 'Community'
    },
    {
      label: 'test',
      value: 'test'
    }
  ];
  public selSiteClassification: any = null;
  public siteClassificationList: any = [
    {
      label: 'Class A',
      value: 'Class A'
    },
    {
      label: 'Class B',
      value: 'Class B'
    },
    {
      label: 'Class C',
      value: 'Class C'
    },
    {
      label: 'Critical',
      value: 'Critical'
    }
  ];
  public selCluster: any = null;
  public clusterList: any = null;
  public selEmployee: any = null;
  public employeeList: any = null;
  public selSim: any = null;
  public simList: any = null;

  public masterForm!: FormGroup;

  private selSite: any = null;
  private siteId: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddSiteComponent>,
    private formBuilder: FormBuilder
  ) {

  }

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
    this.selSiteType = this.siteTypeList[0];
    this.loadData();
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'siteCode': [null, [Validators.required]],
      'siteName': [null, [Validators.required]],
      'address': [null],
      'district': [null],
      'pinCode': [null],
      'latitude': [null],
      'longitude': [null],
      'dvUniqueId': [null],
      'accIdName': [null],
      'dgBrandName': [null],
      'dgTankCapacity': [null]
    });
  }

  getData() {
    if (window.localStorage.getItem('selSite')) {
      this.selSite = JSON.parse((window as any).localStorage.getItem('selSite'));
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.siteId = this.selSite.id;
    this.masterForm.controls['siteCode'].setValue(this.selSite.siteCode);
    this.masterForm.controls['siteName'].setValue(this.selSite.siteName);
    this.masterForm.controls['address'].setValue(this.selSite.address);
    this.masterForm.controls['district'].setValue(this.selSite.district);
    this.masterForm.controls['pinCode'].setValue(this.selSite.pinCode);
    this.masterForm.controls['latitude'].setValue(this.selSite.latitude);
    this.masterForm.controls['longitude'].setValue(this.selSite.longitude);
    this.masterForm.controls['dvUniqueId'].setValue(this.selSite.dvUniqueId);
    this.masterForm.controls['accIdName'].setValue(this.selSite.accIdName);
    this.masterForm.controls['dgBrandName'].setValue(this.selSite.dgBrandName);
    this.masterForm.controls['dgTankCapacity'].setValue(this.selSite.dgTankCapacity);

    this.setSiteTypeDD();
    this.setDeviceTypeDD();
    this.setSiteStatusDD();
    this.setCustomerDD();
    this.setSiteClassificationDD();
  }

  loadData() {
    this.loadCluster();
    this.loadEmployee();
    this.loadSim();
  }

  loadCluster() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.clusterList = data;
      this.setSelClusterDD();
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading employee role list!'
      });
    });
  }

  loadEmployee() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.employeeList = data;
      this.setSelEmployeeDD();
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading employee role list!'
      });
    });
  }

  loadSim() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.simList = data;
      this.setSelSimDD();
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading employee role list!'
      });
    });
  }

  setSiteTypeDD() {
    for (let item of this.siteTypeList) {
      if (item.value === this.selSite.siteTypeId) {
        this.selSiteType = item;
        break;
      }
    }
  }

  setDeviceTypeDD() {
    for (let item of this.deviceTypeList) {
      if (item.value === this.selSite.deviceType) {
        this.selDeviceType = item;
        break;
      }
    }
  }

  setSiteStatusDD() {
    for (let item of this.siteStatusList) {
      if (item.value === this.selSite.siteStatus) {
        this.selSiteStatus = item;
        break;
      }
    }
  }

  setCustomerDD() {
    for (let item of this.customerList) {
      if (item.value === this.selSite.customer) {
        this.selCustomer = item;
        break;
      }
    }
  }

  setSiteClassificationDD() {
    for (let item of this.siteClassificationList) {
      if (item.value === this.selSite.siteClassification) {
        this.selSiteClassification = item;
        break;
      }
    }
  }

  setSelClusterDD() {
    for (let item of this.clusterList) {
      if (item.id === this.selSite.clusterId) {
        this.selCluster = item;
        break;
      }
    }
  }

  setSelEmployeeDD() {
    for (let item of this.employeeList) {
      if (item.id === this.selSite.employeeId) {
        this.selEmployee = item;
        break;
      }
    }
  }

  setSelSimDD() {
    for (let item of this.simList) {
      if (item.id === this.selSite.simId) {
        this.selSim = item;
        break;
      }
    }
  }

  toggleSiteType(evt?: any) {
    this.isSiteTypeDDOpen = !this.isSiteTypeDDOpen;
  }

  selectSiteType(item?: any) {
    this.selSiteType = item;
  }

  toggleCluster(evt?: any) {
    this.isClusterDDOpen = !this.isClusterDDOpen;
  }

  selectCluster(item?: any) {
    this.selCluster = item;
  }

  toggleEmployee(evt?: any) {
    this.isEmployeeDDOpen = !this.isEmployeeDDOpen;
  }

  selectEmployee(item?: any) {
    this.selEmployee = item;
  }

  toggleDeviceType(evt?: any) {
    this.isDeviceTypeDDOpen = !this.isDeviceTypeDDOpen;
  }

  selectDeviceType(item?: any) {
    this.selDeviceType = item;
  }

  toggleSiteStatus(evt?: any) {
    this.isSiteStatusDDOpen = !this.isSiteStatusDDOpen;
  }

  selectSiteStatus(item?: any) {
    this.selSiteStatus = item;
  }

  toggleCustomer(evt?: any) {
    this.isCustomerDDOpen = !this.isCustomerDDOpen;
  }

  selectCustomer(item?: any) {
    this.selCustomer = item;
  }

  toggleSiteClassification(evt?: any) {
    this.isSiteClassificationDDOpen = !this.isSiteClassificationDDOpen;
  }

  selectClassification(item?: any) {
    this.selSiteClassification = item;
  }

  toggleSim(evt?: any) {
    this.isSimDDOpen = !this.isSimDDOpen;
  }

  selectSim(item?: any)  {
    this.selSim = item;
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

      siteCode: formData.siteCode,
      siteName: formData.siteName,
      siteType: this.selSiteType.value,
      clusterId: this.selCluster.id,
      clusterName: this.selCluster.name,
      address: formData.address,
      district: formData.district,
      pinCode: formData.pinCode,
      employeeId: this.selEmployee.id,
      employeeName: this.selEmployee.name,
      latitude: formData.latitude,
      longitude: formData.longitude,
      deviceType: this.selDeviceType.value,
      simId: this.selSim.id,
      simName: this.selSim.name,
      dvUniqueId: formData.dvUniqueId,
      siteStatus: this.selSiteStatus.value,
      customer: this.selCustomer.value,
      siteClassification: this.selSiteClassification.value,
      accIdName: formData.accIdName,
      dgBrandName: formData.dgBrandName,
      dgTankCapacity: formData.dgTankCapacity
    };

    if (this.isForEdit) {
      params.id = this.siteId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isLoading = false;
      this.util.notification.success({
        title: 'Success',
        msg: 'Site details saved successfully...'
      });
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving site details!'
      });
    });
  }


}
