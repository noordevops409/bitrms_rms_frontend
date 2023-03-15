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

  public siteTypeList: any = [
    {
      value: -1,
      label: 'Select Site Type'
    },
    {
      value: 'Hybrid',
      label: 'Hybrid'
    },
    {
      value: 'TEE',
      label: 'TEE'
    }
  ];
  public deviceTypeList: any = [
    {
      value: -1,
      label: 'Select Device Type'
    },
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
  public siteStatusList: any = [
    {
      value: -1,
      label: 'Select Site Status'
    },
    {
      label: 'Active',
      value: 'Active'
    },
    {
      label: 'Inactive',
      value: 'Inactive'
    }
  ];
  public customerList: any = [
    {
      value: -1,
      label: 'Select Customer'
    },
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
  public siteClassificationList: any = [
    {
      value: -1,
      label: 'Select Classification'
    },
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

  public clusterList: any = null;
  public employeeList: any = null;
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
    this.loadData();
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'siteCode': [null, [Validators.required]],
      'siteName': [null, [Validators.required]],
      'selSiteType': [-1],
      'selDeviceType': [-1],
      'selSiteStatus': [-1],
      'selCustomer': [-1],
      'selSiteClassification': [-1],
      'selCluster': [-1],
      'selEmployee': [-1],
      'selSim': [-1],
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
    this.masterForm.controls['selSiteType'].setValue(this.selSite.selSiteType);
    this.masterForm.controls['selDeviceType'].setValue(this.selSite.selDeviceType);
    this.masterForm.controls['selSiteStatus'].setValue(this.selSite.selSiteStatus);
    this.masterForm.controls['selCustomer'].setValue(this.selSite.selCustomer);
    this.masterForm.controls['selSiteClassification'].setValue(this.selSite.selSiteClassification);
    this.masterForm.controls['selCluster'].setValue(this.selSite.selCluster);
    this.masterForm.controls['selEmployee'].setValue(this.selSite.selEmployee);
    this.masterForm.controls['selSim'].setValue(this.selSite.selSim);
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
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading employee role list!'
      });
    });
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
      siteType: formData.selSiteType,
      clusterId: formData.selCluster,
      clusterName: formData.selCluster,
      address: formData.address,
      district: formData.district,
      pinCode: formData.pinCode,
      employeeId: formData.selEmployee.id,
      employeeName: formData.selEmployee.name,
      latitude: formData.latitude,
      longitude: formData.longitude,
      deviceType: formData.selDeviceType.value,
      simId: formData.selSim.id,
      simName: formData.selSim.name,
      dvUniqueId: formData.dvUniqueId,
      siteStatus: formData.selSiteStatus.value,
      customer: formData.selCustomer.value,
      siteClassification: formData.selSiteClassification.value,
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
