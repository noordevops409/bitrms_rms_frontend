import { Inject, Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.scss']
})
export class AddIssueComponent implements OnInit {

  @Output() saveEvent = new EventEmitter<void>();

  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  public masterForm!: FormGroup;

  private selIssueCategory: any = null;
  private issueCatID: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddIssueComponent>,
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
      'name': [null, [Validators.required]]
    });
  }

  getData() {
    if (this.data) {
      this.selIssueCategory = this.data;
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.issueCatID = this.selIssueCategory.issueCatID;
    this.masterForm.controls['name'].setValue(this.selIssueCategory.issuename);
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
    const url = ApiConstant.saveIssueCategoryData;
    let params: any = {
      issuename: formData.name
    };

    if (this.isForEdit) {
      params.issueCatID = this.issueCatID;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isSaving = false;
      this.dialogRef.close(data);
      this.util.notification.success({
        title: 'Success',
        msg: 'Issue category details saved successfully...'
      });
      this.saveEvent.emit();
    }, (err) => {
      this.isSaving = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving issue category details!'
      });
    });
  }

}
