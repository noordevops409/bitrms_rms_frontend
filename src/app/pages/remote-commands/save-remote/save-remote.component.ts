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


@Component({
  selector: 'app-save-remote',
  templateUrl: './save-remote.component.html',
  styleUrls: ['./save-remote.component.scss']
})
export class SaveRemoteComponent implements OnInit, OnDestroy {

  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  public masterForm!: FormGroup;

  private selRemoteCommandData: any = null;
  private rmcid: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SaveRemoteComponent>,
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
    this.getData();
    this.isLoading = false;
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'oudcommand': [null, [Validators.required]]
    });
  }

  getData() {
    if (this.data) {
      this.selRemoteCommandData = this.data;
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.rmcid = this.selRemoteCommandData.rmcid;
    this.masterForm.controls['oudcommand'].setValue(this.selRemoteCommandData.configureValue);
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
    const url = ApiConstant.saveOutgoingData;
    let params: any = {
      oudcommand: this.data.code + " " + formData.oudcommand,
      oudcommandtype: this.data.oudcommandtype,
      ouddeviceid: this.data.ouddeviceid,
      ouddevicetype: this.data.ouddevicetype,
      oudmode: this.data.oudmode,
      oudstatus: this.data.oudstatus,
      smsitecode: this.data.smsitecode,
      smsiteid: this.data.smsiteid,
      updateval: this.data.updateval
    };
    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isSaving = false;
      this.dialogRef.close(data);
      this.util.notification.success({
        title: 'Success',
        msg: 'Saved successfully...'
      });
    }, (err) => {
      this.isSaving = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving details!'
      });
    });
  }
}
