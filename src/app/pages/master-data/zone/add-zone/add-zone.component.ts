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
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.scss']
})
export class AddZoneComponent implements OnInit, OnDestroy {

  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;
  public masterForm!: FormGroup;
  public isRegionDDOpen: boolean = false;
  public isCountryDDOpen: boolean = false;
  public regionList: any = null;
  public countryList: any = null;

  private selZone: any = null;
  private zoneId: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddZoneComponent>,
    private formBuilder: FormBuilder
  ) { }

  get mf() {
    return (this.masterForm as any).controls;
  }

  ngOnInit(): void {
    this.loadCountryData();
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
      'name': [null, [Validators.required]],
      'acsysSyncStatusName': [null],
      'acsysSyncDateName': [null],
      'acsysSyncTimeName': [null],
      'accIdName': [null],
      'selRegion': [null],
      'selCountry': [null]
    });
  }

  loadData() {
    this.loadCountryData();
    this.loadRegionData();
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

  loadRegionData() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.regionList = data;
      this.masterForm.controls['selRegion'].setValue(data[0]);
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading region list!'
      });
    });
  }

  getData() {
    if (this.data) {
      this.selZone = this.data;
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.zoneId = this.selZone.znZoneID;
    this.masterForm.controls['name'].setValue(this.selZone.znZone);

    let acsysSyncDateTimeName = this.selZone.znAcsysSyncDateTime.split(' ');
    this.masterForm.controls['acsysSyncStatusName'].setValue(this.selZone.znAcsysSyncstatus);
    this.masterForm.controls['acsysSyncDateName'].setValue(acsysSyncDateTimeName[0]);
    this.masterForm.controls['acsysSyncTimeName'].setValue(acsysSyncDateTimeName[1]);
    this.masterForm.controls['accIdName'].setValue(this.selZone.accID);
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
      regionId: formData.selRegion.id,
      regionName: formData.selRegion.name,
      countryId: formData.selCountry.id,
      countryName: formData.selCountry.name,
      acsysSyncDateTimeName: acsysSyncDateTimeName,
      acsysSyncStatusName: formData.acsysSyncStatusName,
      accIdName: formData.accIdName
    };

    if (this.isForEdit) {
      params.id = this.zoneId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isLoading = false;
      this.util.notification.success({
        title: 'Success',
        msg: 'Zone details saved successfully...'
      });
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving zone details!'
      });
    });
  }

}
