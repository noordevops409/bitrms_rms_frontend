import { Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
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
  public isLoading: boolean = false;
  public isForEdit: boolean = false;

  public masterForm!: FormGroup;

  private selUser: any = null;
  private userId: any = null;

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

  init() {

  }

  initForm() {

  }

  getData() {

  }

  setFormData() {

  }

  close(evt?: any) {
    this.dialogRef.close();
  }

  cancel(evt?: any) {
    this.close();
  }

}
