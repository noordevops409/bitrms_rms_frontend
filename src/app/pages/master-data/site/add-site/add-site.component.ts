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
      value: 1,
      label: 'Hybrid'
    },
    {
      value: 2,
      label: 'TEE'
    }
  ];
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
  public siteStatusList: any = [
    {
      label: 'Active',
      value: 1
    },
    {
      label: 'Inactive',
      value: 0
    }
  ];
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
  public siteClassificationList: any = [
    {
      label: 'Class A',
      value: 1
    },
    {
      label: 'Class B',
      value: 2
    },
    {
      label: 'Class C',
      value: 3
    },
    {
      label: 'Critical',
      value: 4
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
    this.initForm();
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {
    this.loadCluster();
    this.loadEmployee();
    this.loadSim();
    setTimeout(() => {
      this.getData();
    }, 1000);
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'siteCode': [null, [Validators.required]],
      'siteName': [null, [Validators.required]],
      'selSiteType': [null],
      'selDeviceType': [null],
      'selSiteStatus': [null],
      'selCustomer': [null],
      'selSiteClassification': [null],
      'selCluster': [null],
      'selEmployee': [null],
      'selSim': [null],
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
    if (this.data) {
      this.selSite = this.data;
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.siteId = this.selSite.id;
    this.masterForm.controls['siteCode'].setValue(this.selSite.smSitecode);
    this.masterForm.controls['siteName'].setValue(this.selSite.smSitename);
    this.masterForm.controls['address'].setValue(this.selSite.smAddress);
    this.masterForm.controls['district'].setValue(this.selSite.smDistrict);
    this.masterForm.controls['pinCode'].setValue(this.selSite.smPincode);
    this.masterForm.controls['latitude'].setValue(this.selSite.smLatitude);
    this.masterForm.controls['longitude'].setValue(this.selSite.smLongitude);
    this.masterForm.controls['dvUniqueId'].setValue(this.selSite.dvuniqueid);
    this.masterForm.controls['accIdName'].setValue(this.selSite.accID);
    this.masterForm.controls['dgBrandName'].setValue(this.selSite.dgBrand);
    this.masterForm.controls['dgTankCapacity'].setValue(this.selSite.dgTankCapacity);

    this.masterForm.controls['selSiteType'].setValue(this.selSite.smSitetypeid);
    this.masterForm.controls['selDeviceType'].setValue(this.selSite.devicetype);
    this.masterForm.controls['selSiteStatus'].setValue(this.selSite.smSiteactivestatus);
    this.masterForm.controls['selCustomer'].setValue(this.selSite.smCustomerId);
    this.masterForm.controls['selSiteClassification'].setValue(this.selSite.smscid);

    this.setSim(this.selSite);
    this.setCluster(this.selSite);
    this.setEmployeeId(this.selSite);
  }

  loadCluster() {
    const url = ApiConstant.getClusterMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.clusterMasterList && data.clusterMasterList.length) {
        this.clusterList = data.clusterMasterList;
        this.masterForm.controls['selCluster'].setValue(data.clusterMasterList[0]);
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading cluster list!'
      });
    });
  }

  loadSim() {
    const url = ApiConstant.getSimMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.simMasterList && data.simMasterList.length) {
        this.simList = data.simMasterList;
        this.masterForm.controls['selSim'].setValue(data.simMasterList[0]);
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading sim list!'
      });
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

  setSim(req?: any) {
    for (let item of this.simList) {
      if (item.simID === req.simID) {
        req.simNumber = item.simNumber;
        break;
      }
    }
  }

  setCluster(req?: any) {
    for (let item of this.clusterList) {
      if (item.crClusterID === req.crClusterID) {
        req.clusterName = item.crName;
        break;
      }
    }
  }

  setEmployeeId(req?: any) {
    for (let item of this.employeeList) {
      if (item.emEmpID === req.smTechEmpid) {
        req.employeeId = item.emEmployeeID;
        break;
      }
    }
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
    const url = ApiConstant.saveSiteMasterData;

    let params: any = {
      smSitecode: formData.siteCode,
      smSitename: formData.siteName,
      smSitetypeid: formData.selSiteType,
      crClusterID: formData.selCluster.crClusterID,
      smAddress: formData.address,
      smDistrict: formData.district,
      smPincode: formData.pinCode,
      smTechEmpid: formData.selEmployee.emEmpID,
      smLatitude: formData.latitude,
      smLongitude: formData.longitude,
      devicetype: formData.selDeviceType.value,
      simID: formData.selSim.simID,
      dvuniqueid: formData.dvUniqueId,
      smSiteactivestatus: formData.selSiteStatus.value,
      smCustomerId: formData.selCustomer.value,
      smscid: formData.selSiteClassification.value,
      accID: formData.accIdName,
      dgBrand: formData.dgBrandName,
      dgTankCapacity: formData.dgTankCapacity,
      username: 'harish1'
    };

    if (this.isForEdit) {
      params.smSiteID = this.siteId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isSaving = false;
      this.dialogRef.close(data);
      this.util.notification.success({
        title: 'Success',
        msg: 'Site details saved successfully...'
      });
    }, (err) => {
      this.isSaving = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving site details!'
      });
    });
  }
}
