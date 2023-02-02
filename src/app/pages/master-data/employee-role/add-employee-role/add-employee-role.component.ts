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
  selector: 'app-add-employee-role',
  templateUrl: './add-employee-role.component.html',
  styleUrls: ['./add-employee-role.component.scss']
})
export class AddEmployeeRoleComponent implements OnInit, OnDestroy {

  public showSaving: boolean = false;
  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  
  public masterForm!: FormGroup;
  
  private selEmployeeRole: any = null;
  private employeeRoleId: any = null;
  
  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEmployeeRoleComponent>,
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

  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'name': [null, [Validators.required]],
      'isPredefined': [null],
      'roleCategoryId': [null],
      'isEscalationReq': [null],
      'categoryId': [null]
    });
  }

  getData() {
    if (window.localStorage.getItem('selEmployeeRole')) {
      this.selEmployeeRole = JSON.parse((window as any).localStorage.getItem('selEmployeeRole'));
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.employeeRoleId = this.selEmployeeRole.id;
    this.masterForm.controls['name'].setValue(this.selEmployeeRole.name);
    this.masterForm.controls['isPredefined'].setValue(this.selEmployeeRole.isPredefined);
    this.masterForm.controls['roleCategoryId'].setValue(this.selEmployeeRole.roleCategoryId);
    this.masterForm.controls['isEscalationReq'].setValue(this.selEmployeeRole.isEscalationReq);
    this.masterForm.controls['categoryId'].setValue(this.selEmployeeRole.categoryId);
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
      isPredefined: formData.isPredefined,
      roleCategoryId: formData.roleCategoryId,
      isEscalationReq: formData.isEscalationReq,
      categoryId: formData.categoryId
    };

    if (this.isForEdit) {
      params.id = this.employeeRoleId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isLoading = false;
      this.util.notification.success({
        title: 'Success',
        msg: 'Employee Role details saved successfully...'
      });
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving employee role details!'
      });
    });
  }

}
