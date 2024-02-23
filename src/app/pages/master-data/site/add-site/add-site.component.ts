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

  public siteTypeList: any = [];
  public deviceTypeList: any = [];
  public customerList: any = [];
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

  public clusterList: any[] = [];
  public employeeList: any[] = [];
  public simList:any[] = [];

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
    this.isSaving = true;
    this.loadCluster();
    this.loadEmployee();
    this.loadDeviceType();
    this.loadSim();
    this.loadCustomer();
    setTimeout(() => {
      
      this.getData();
      this.isSaving = false;
    }, 6000);
    this.loadSiteType();
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'siteCode': [null, [Validators.required]],
      'siteName': [null, [Validators.required]],
      'selSiteType': [null],
      'selDeviceType': [null],
      'selSiteStatus': [this.siteStatusList[0]],
      'selCustomer': [null],
      'selSiteClassification': [this.siteClassificationList[0]],
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
      'dgTankCapacity': [null],
      'dcStartBattVolValue': [null],
      'settableCommLoadValue': [null],
      'battLifeCycleValue': [null],
      'dgRunHourValue': [null],
      'settableLoadValue':[null],

    });
  }

  getData() {
    if (this.data) {
      this.isForEdit = true;
      this.selSite = this.data;
      this.setFormData();
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
   // console.log("this.selSite.smSitetypeid",this.selSite.smSitetypeid);
    
    //this.masterForm.controls['selSiteType'].setValue(this.selSite.smSitetypeid);
    this.masterForm.controls['dgBrandName'].setValue(this.selSite.dgBrand);
    this.masterForm.controls['dgTankCapacity'].setValue(this.selSite.dgTankCapacity);
    this.masterForm.controls['dcStartBattVolValue'].setValue(this.selSite.dcStartBattVol);
    this.masterForm.controls['settableCommLoadValue'].setValue(this.selSite.settableCommLoad);
    this.masterForm.controls['battLifeCycleValue'].setValue(this.selSite.battLifeCycle);
    this.masterForm.controls['dgRunHourValue'].setValue(this.selSite.dgRunHour);
    this.masterForm.controls['settableLoadValue'].setValue(this.selSite.settableLoad);


    //this.setSiteType(this.selSite);
    this.loadSiteTypeUpdate();
    this.setCluster(this.selSite);
    this.setEmployeeId(this.selSite);
    this.setDeviceType(this.selSite);
    this.setSim(this.selSite);
    this.setCustomer(this.selSite);
    this.setSiteClassification(this.selSite);
    this.setSiteStatus(this.selSite);
  }


  loadSiteType() {
    const url = ApiConstant.getSiteType;
    this.httpClient.get(url).subscribe((res: any) => {
      this.siteTypeList = res.data;
      this.masterForm.controls['selSiteType'].setValue(res.data[0]);
     
     
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading site type list!'
      });
    });
  }


  loadSiteTypeUpdate()
  {
  const url = ApiConstant.getSiteType;
  this.httpClient.get(url).subscribe((res: any) => {
    this.siteTypeList = res.data;
    
   if(this.selSite.smSitetypeid==1)
   {
    this.masterForm.controls['selSiteType'].setValue(res.data[0]);
   }
   
  else{
    this.masterForm.controls['selSiteType'].setValue(res.data[1]);
  }
  
   });
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

  loadDeviceType() {
    const url = ApiConstant.getDeviceTypeMaster;
    this.httpClient.get(url).subscribe((res: any) => {
      if (res && res.data && res.data.length) {
        let counter = 0;
        for (let item of res.data) {
          counter += 1;
          item.id = counter;
        }
        this.deviceTypeList = res.data;
        //console.log("0000000258",this.deviceTypeList);
        this.masterForm.controls['selDeviceType'].setValue(res.data[0]);
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading device type list!'
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

  // loadCustomer() {
  //   const url = ApiConstant.getSiteCustomerMaster;
  //   this.httpClient.get(url).subscribe((res: any) => {
  //     if (res && res.data && res.data.length) {
  //       let counter = 0;
  //       for (let item of res.data) {
  //         console.log("line 294",res.data);

  //         counter += 1;
  //         item.id = counter;
  //       }
  //       this.customerList = res.data;
  //       console.log("customerList",this.customerList);

  //       this.masterForm.controls['selCustomer'].setValue(res.data[0]);
  //     }
  //   }, (err) => {
  //     this.util.notification.error({
  //       title: 'Error',
  //       msg: 'Error while loading customer list!'
  //     });
  //   });
  // }
  loadCustomer() {
    const url = ApiConstant.getSiteCustomerMaster;
    this.httpClient.get(url).subscribe((res: any) => {
      if (res && res.data && res.data.length) {
        const customerData = res.data.map((item: any) => {
          return { value: item.customer_id, name: item.customer_name };
        });
        
       // console.log(customerData[0]);
        this.customerList=customerData;
        console.log("line 321",this.customerList);
        this.masterForm.controls['selCustomer'].setValue(this.customerList[0]);

      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading customer list!'
      });
    });
  }
  

  setSiteType(req?: any) {
    for (let item of this.siteTypeList) {
     
      if (item.id === req.smSitetypeid) {
        req.siteType = item.type;
        this.masterForm.controls['selSiteType'].setValue(item);
        break;
      }
    }
  }

  setCluster(req?: any) {
    for (let item of this.clusterList) {
      if (item.crClusterID === req.crClusterID) {
        req.clusterName = item.crName;
        this.masterForm.controls['selCluster'].setValue(item);
        break;
      }
    }
  }

  setEmployeeId(req?: any) {
    for (let item of this.employeeList) {
      if (item.emEmpID === req.smTechEmpid) {
        req.employeeId = item.emEmployeeID;
        this.masterForm.controls['selEmployee'].setValue(item);
        break;
      }
    }
  }

  setDeviceType(req?: any) {
    for (let item of this.deviceTypeList) {
      if (item.id == req.devicetype) {
        req.deviceType = item.deviceType;
        this.masterForm.controls['selDeviceType'].setValue(item);
        break;
      }
    }
  }

  setSim(req?: any) {
    for (let item of this.simList) {
      if (item.simID === req.simID) {
        req.simNumber = item.simNumber;
        this.masterForm.controls['selSim'].setValue(item);
        break;
      }
    }
  }

  setCustomer(req?: any) {
    for (let item of this.customerList) {
      console.log("363 line",this.customerList)
      if (item.name == req.customerName) {
        req.customerName = item.name;
        this.masterForm.controls['selCustomer'].setValue(item);
        break;
      }
    }
  }

  setSiteClassification(req?: any) {
    for (let item of this.siteClassificationList) {
    

      if (item.label == req.smSiteClassifications) {
        req.siteClassifications= item.label;
        
        this.masterForm.controls['selSiteClassification'].setValue(item);
        break;
      }
    }
    
  }
  setSiteStatus(req?: any)
    {
      for (let item of this.siteStatusList) {
        if (item.label == req.siteStatusName) {
          req.siteClassifications= item.label;
          this.masterForm.controls['selSiteStatus'].setValue(item);
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
//console.log("line 434",formData.selCustomer.value);
    let params: any = {
      smSitecode: formData.siteCode,
      smSitename: formData.siteName,
      smSitetypeid: formData.selSiteType.id,
      crClusterID: formData.selCluster.crClusterID,
      smAddress: formData.address,
      smDistrict: formData.district,
      smPincode: formData.pinCode,
      smTechEmpid: formData.selEmployee.emEmpID,
      smLatitude: formData.latitude,
      smLongitude: formData.longitude,
      devicetype: formData.selDeviceType.id,
      simID: formData.selSim.simID,
      dvuniqueid: formData.dvUniqueId,
      smSiteactivestatus: formData.selSiteStatus.value,
      smCustomerId: formData.selCustomer.value,
      smscid: formData.selSiteClassification.value,
      accID: formData.accIdName,
      dgBrand: formData.dgBrandName,
      dgTankCapacity: formData.dgTankCapacity,
      dcStartBattVol: formData.dcStartBattVolValue,
      settableCommLoad: formData.settableCommLoadValue,
      battLifeCycle: formData.battLifeCycleValue,
      dgRunHour: formData.dgRunHourValue,
      settableLoad:formData.settableLoadValue,
      deviceTypeName:formData.selDeviceType.deviceType,
      customerName:formData.selCustomer.name,
      smCustomerName:formData.selCustomer.name,
      siteStatusName:formData.selSiteStatus.label,
      smSiteClassifications:formData.selSiteClassification.label,
      username: 'harish'
    };

    if (this.isForEdit) {
      params.smSiteID = this.selSite.smSiteID;
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
