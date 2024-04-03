import { Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { iif, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { BroadcastService } from '../../../shared/broadcast.service';
import { CommonUtilService } from '../../../shared/common-util.service';
import { ApiConstant } from '../../../shared/api-constant.enum';
import { AppConstant } from '../../../shared/app-constant.enum';
import * as moment from 'moment';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit, OnDestroy {

  public isSaving: boolean = false;
  public isDuplicateCheck: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;

  public customerList: any = [];
  public customerRoleList: any = [];
  public userRoleList: any = [];

  public masterForm!: FormGroup;

  private selUser: any = null;
  private umID: any = null;
  activationStatusOptions: any = [
    { value: '0', label: 'Active' },
    { value: '1', label: 'Inactive' }
  ];
  selectedActivationStatus: any;
  indexVar: any;
  umLoginTypeOptions: any = [
    { value: '0', label: 'ALL' },
    { value: '1', label: 'Myanmar' },
    {
      value: '2', label: 'Philippines'
    }

  ];
  umlevelAccessOptions:any=[
    { value: '1', label: 'Admin' },
    { value: '2', label: 'NOC1' },
    { value: '3', label: 'NOC2'},
    { value: '4', label: 'Customer'}

  ]
  umLoginTypeIndexVar: any;
  umLevelAccessIndexVar: any;


  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    private formBuilder: FormBuilder
  ) {

  }

  get mf() {
    return (this.masterForm as any).controls;
  }

  ngOnInit(): void {
    this.init();
    this.initForm();
  }

  ngOnDestroy(): void {

  }

  passwordConfirming(c: any): any {
    if (c.get('password').value !== c.get('cnfPassword').value) {
      return { invalid: true };
    }
  }

  init() {
    this.loadCustomer();
    this.loadCustomerRole();
    this.loadUserRole();
    // this.loadUserStatus();
    setTimeout(() => {
      this.getData();
    }, 1000);
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'firstName': [null, [Validators.required]],
      'lastName': [null, [Validators.required]],
      'umEmailid': [null, [Validators.required, Validators.email]],
      'uname': [null, [Validators.required]],
      'pwd': ['', [Validators.required]],
      'cnfPassword': ['', [Validators.required]],
      'selCustomer': [null],
      'selCustomerRole': [null],
      'selUserRole': [null],
      'mobile': [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      'umAactivationstatus': [null],

      'umlevelAccess': [null],
      'umDescription': [null],
      'umLoginType': [null],
      'umType': [0],
      'utID': [0]
    }, {
      validator: this.confirmedValidator('pwd', 'cnfPassword')
    })
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl: any = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  loadCustomer() {
    const url = ApiConstant.getCustomerNameList;
    this.httpClient.get(url).subscribe((data: any) => {
      if (data && data.customername && data.customername.length) {
        this.customerList = data.customername;
        this.masterForm.controls['selCustomer'].setValue(data.customername[0]);
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading customer name list!'
      });
    });
  }

  loadCustomerRole() {
    const url = ApiConstant.getCustomerRoleList;
    this.httpClient.get(url).subscribe((data: any) => {
      if (data && data.customerrole && data.customerrole.length) {
        this.customerRoleList = data.customerrole;
        this.masterForm.controls['selCustomerRole'].setValue(data.customerrole[0]);
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading customer role list!'
      });
    });
  }

  loadUserRole() {
    const url = ApiConstant.getRoleList;
    this.httpClient.get(url).subscribe((data: any) => {
      if (data && data.roleuser && data.roleuser.length) {
        this.userRoleList = data.roleuser;
        this.masterForm.controls['selUserRole'].setValue(data.roleuser[0]);
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading user role list!'
      });
    });
  }

  //   loadUserStatus() {
  //     const activeStatus = this.activationStatusOptions.find(status => status.value === '0');
  // console.log("activeStatus",activeStatus)
  //       // this.masterForm.controls['umAactivationstatus'].setValue();

  //   }



  setCustomer(req) {
    for (let item of this.customerList) {
      if (item.customerid == req.customerId) {
        req.customerName = item.customername;
        this.masterForm.controls['selCustomer'].setValue(item);
        break;
      }
    }
  }

  setCustomerRole(req) {
    for (let item of this.customerRoleList) {
      if (item.customerroleid == req.customerRoleId) {
        req.customerRoleName = item.customerdesc;
        this.masterForm.controls['selCustomerRole'].setValue(item);
        break;
      }
    }
  }

  setUserRole(req) {
    for (let item of this.userRoleList) {
      if (item.roleid == req.roleId) {
        req.roleName = item.rolename;
        this.masterForm.controls['selUserRole'].setValue(item);
        break;
      }
    }
  }

  setUserActiveStatus(req) {
    const selectedStatus = this.activationStatusOptions.find(item => item.value == req.umAactivationstatus);
    if (selectedStatus) {
      this.indexVar = selectedStatus.value;
    }
  }
  setUmLoginType(req) {
    const selectedStatus = this.umLoginTypeOptions.find(item => item.value == req.umLoginType);
    if (selectedStatus) {
      this.umLoginTypeIndexVar = selectedStatus.value;
    }
  }
  setUmLevelAcess(req) {
    const selectedStatus = this.umlevelAccessOptions.find(item => item.value == req.umDashboardLevelIds);
    console.log('CHECK 2 APril: ',selectedStatus)
    if (selectedStatus) {      
      this.umLevelAccessIndexVar = selectedStatus.value;
      console.log('CHECK 2 APril12 : ',this.umLevelAccessIndexVar)
    }
  }



  getData() {
    if (this.data) {
      this.isForEdit = true;
      this.selUser = this.data;
      this.setFormData();
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.umID = this.selUser.umID;

    if (this.selUser.umName) {
      let nameList = this.selUser.umName.split(" ");
      this.masterForm.controls['firstName'].setValue(nameList[0]);
      this.masterForm.controls['lastName'].setValue(nameList[1]);
    }
    this.masterForm.controls['umEmailid'].setValue(this.selUser.umEmailid);



    this.masterForm.controls['mobile'].setValue(this.selUser.umMobileNumber);
    // this.masterForm.controls['umAactivationstatus'].setValue(this.selUser.umAactivationstatus);
    this.masterForm.controls['umDescription'].setValue(this.selUser.umDescription);

    //this.masterForm.controls['umLoginType'].setValue(this.selUser.umLoginType);
    this.masterForm.controls['umType'].setValue(this.selUser.umType);
    this.masterForm.controls['utID'].setValue(this.selUser.utID);

    this.setCustomer(this.selUser);
    this.setCustomerRole(this.selUser);
    this.setUserRole(this.selUser);
    this.setUserActiveStatus(this.selUser);
    this.setUmLoginType(this.selUser);
    this.setUmLevelAcess(this.selUser);

    setTimeout(() => {
      this.masterForm.controls['uname'].setValue(this.selUser.username);
      this.masterForm.controls['pwd'].setValue(this.selUser.password);
      this.masterForm.controls['cnfPassword'].setValue(this.selUser.password);
    }, 500);
  }
  setLoginType(selUser: any) {
    throw new Error('Method not implemented.');
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
    this.isDuplicateCheck = false;
    const formData = this.masterForm.value;
    
    const url = ApiConstant.saveEditUserDetails;
    let params: any = {
      customerId: formData.selCustomer.customerid,
      customerRoleId: formData.selCustomerRole.customerroleid,
      roleId: formData.selUserRole.roleid,
      password: formData.pwd,
      umAactivationstatus: formData.umAactivationstatus.value,
      umDashboardLevelIds:formData.umlevelAccess.value,
      umDescription: formData.umDescription,
      umEmailid: formData.umEmailid,
      umLoginType: formData.umLoginType.value,
      umMobileNumber: formData.mobile,
      
      umName: formData.firstName.replace(/\s/g, '').trim()+ ' ' +formData.lastName.replace(/\s/g, '').trim(),
      umType: formData.umType,
      username: formData.uname
    };

    if (this.isForEdit) {
      params.umID = this.selUser.umID;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isSaving = false;
      if(data?.status == "Dupliate"){
        this.isDuplicateCheck = true
      }else{
        this.dialogRef.close(data);      
        this.util.notification.success({
          title: 'Success',
          msg: 'User details saved successfully...'
        });
      }
      
    }, (err) => {     
      this.isSaving = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving user details!'
      });
    });
  }

}
