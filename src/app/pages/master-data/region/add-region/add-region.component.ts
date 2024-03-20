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
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-add-region',
  templateUrl: './add-region.component.html',
  styleUrls: ['./add-region.component.scss']
})
export class AddRegionComponent implements OnInit, OnDestroy {

  public isSubmiting: boolean = false;
  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isForEdit: boolean = false;

  public masterForm!: FormGroup;
  public isCountryDDOpen: boolean = false;
  public countryList: any = null;


  public date!: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate!: moment.Moment;
  public maxDate!: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public disableMinute = 0;
  public hideTime = 0;
  public color: ThemePalette = 'primary';


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
    this.initForm();
    this.init();
  }

  ngOnDestroy(): void {

  }

  init() {
    if (this.data) {
      this.isLoading = true;
    }
    this.loadCountryData();
    setTimeout(() => {
      this.getData();
      this.isLoading = false;
    }, 1000);
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'name': [null, [Validators.required]],
      'acsysSyncStatusName': [null],
      'acsysSyncDateName': [null],
      'accIdName': [null],
      'selCountry': [null]
    });
  }

  loadCountryData() {
    let url = ApiConstant.getCountryMasterData;
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
        const userData = JSON.parse(userDataString); // Parse the userData JSON string from localStorage
        if (userData && userData.countryID) {
            url += `?countryId=${userData.countryID}`; 
        }
    }
    
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.countryMasterList && data.countryMasterList.length) {
        this.countryList = data.countryMasterList;
        this.masterForm.controls['selCountry'].setValue(data.countryMasterList[0]);
      }
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading country list!'
      });
    });
  }

  setCountry(req: any) {
    for (let item of this.countryList) {
      if (item.countryID === req.cmID) {
        this.selRegion.selCountry = item;
        this.masterForm.controls['selCountry'].setValue(item);
        break;
      }
    }
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
    this.regionId = this.selRegion.rgRegionID;
    this.masterForm.controls['name'].setValue(this.selRegion.rgRegion);

    this.masterForm.controls['acsysSyncStatusName'].setValue(this.selRegion.rgAcsysSyncstatus);
    this.masterForm.controls['acsysSyncDateName'].setValue(this.selRegion.rgAcsysSyncDateTime);
    this.masterForm.controls['accIdName'].setValue(this.selRegion.accID);

    this.setCountry(this.selRegion);
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

    let params: any = {
      rgRegion: formData.name,
      cmID: formData.selCountry.countryID,
      rgAcsysSyncDateTime: formData.acsysSyncDateName,
      rgAcsysSyncstatus: formData.acsysSyncStatusName,
      accID: formData.accIdName
    };

    if (this.isForEdit) {
      params.rgRegionID = this.regionId;
    }

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isSaving = false;
      this.dialogRef.close(data);
      this.util.notification.success({
        title: 'Success',
        msg: 'Region details saved successfully...'
      });
    }, (err) => {
      this.isSaving = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving region details!'
      });
    });
  }

}
