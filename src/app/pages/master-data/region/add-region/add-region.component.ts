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
  selector: 'app-add-region',
  templateUrl: './add-region.component.html',
  styleUrls: ['./add-region.component.scss']
})
export class AddRegionComponent implements OnInit, OnDestroy {

  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  
  public masterForm!: FormGroup;
  public isCountryDDOpen: boolean = false;
  public countryList: any = null;

  private selRegion: any = null;
  private regionId: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddRegionComponent>,
    private formBuilder: FormBuilder
  ) { }

  get mf() {
    return (this.masterForm as any).controls;
  }

  ngOnInit(): void {
    this.init();
    this.initForm();
    this.loadCountryData();
    this.getData();
  }

  ngOnDestroy(): void {

  }

  init() {

  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'name': [null, [Validators.required]],
      'acsysSyncStatusName': [null],
      'acsysSyncDateName': [null],
      'acsysSyncTimeName': [null],
      'accIdName': [null],
      'selCountry': [null]
    });
  }

  loadCountryData() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.countryList = data;
      this.masterForm.controls['selCountry'].setValue(data[0]);
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading country list!'
      });
    });
  }

  getData() {
    if (this.data) {
      this.selRegion = this.data;
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.regionId = this.selRegion.id;
    this.masterForm.controls['name'].setValue(this.selRegion.rgRegion);

    let acsysSyncDateTimeName = this.selRegion.rgAcsysSyncDateTime.split(' ');
    this.masterForm.controls['acsysSyncStatusName'].setValue(this.selRegion.rgAcsysSyncstatus);
    this.masterForm.controls['acsysSyncDateName'].setValue(acsysSyncDateTimeName[0]);
    this.masterForm.controls['acsysSyncTimeName'].setValue(acsysSyncDateTimeName[1]);
    this.masterForm.controls['accIdName'].setValue(this.selRegion.accID);
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
    const url = ApiConstant.saveRegionMasterData;

    let acsysSyncDateTimeName = moment(formData.acsysSyncDateName + ' ' + formData.acsysSyncTimeName);

    let params: any = {
      rgRegion: formData.name,
      cmID: formData.selCountry.id,
      countryName: formData.selCountry.name,
      rgAcsysSyncDateTime: acsysSyncDateTimeName,
      rgAcsysSyncstatus: formData.acsysSyncStatusName,
      accID: formData.accIdName
    };

    if (this.isForEdit) {
      params.rgRegionID = this.regionId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isLoading = false;
      this.dialogRef.close(data);
      this.util.notification.success({
        title: 'Success',
        msg: 'Region details saved successfully...'
      });
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving region details!'
      });
    });
  }

}
