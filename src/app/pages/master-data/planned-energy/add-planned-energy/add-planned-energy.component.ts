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
  selector: 'app-add-planned-energy',
  templateUrl: './add-planned-energy.component.html',
  styleUrls: ['./add-planned-energy.component.scss']
})
export class AddPlannedEnergyComponent implements OnInit, OnDestroy {

  public isForEdit: boolean = false;
  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isSiteCodeDDOpen: boolean = false;
  public siteCodeList: any = null;
  public selSiteCode: any = null;

  public masterForm!: FormGroup;

  private selPlannedEnergy: any = null;
  private plannedEnergyId: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPlannedEnergyComponent>,
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
    this.loadSiteCode();

    setTimeout(() => {
      this.isLoading = true;
      this.getData();
      this.isLoading = false;
    }, 3000);
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'selSiteCode': [null],
      'solarOutputEnergy': [null],
      'solarRunHrs': [null],
      'dgEnergy': [null],
      'dgRunHrs': [null],
      'mdgEnergy': [null],
      'mdgRunHrs': [null],
      'battDisEnergy': [null],
      'battRunHrs': [null],
      'battChargingEnergy': [null],
      'battChargingRunHrs': [null],
      'solarBattRunHrs': [null],
      'solarDGRunHrs': [null],
      'solarMDGRunHrs': [null],
      'teleEnergy': [null],
      'teleRunHrs': [null],
      'communityLoadEnergy': [null],
      'communityLoadRunHrs': [null],
      'opco1': [null],
      'opco1RunHrs': [null],
      'opco2': [null],
      'opco2RunHrs': [null],
      'opco3': [null],
      'opco3RunHrs': [null],
      'opco4': [null],
      'opco4RunHrs': [null]
    });
  }

  getData() {
    if (this.data) {
      this.selPlannedEnergy = this.data;
      this.setFormData();
     // console.log("101")
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.plannedEnergyId = this.selPlannedEnergy.smSitecode;

    this.masterForm.controls['solarOutputEnergy'].setValue(this.selPlannedEnergy.planedSolarOutputenergykwh);
    this.masterForm.controls['solarRunHrs'].setValue(this.selPlannedEnergy.planedSolarRunHrs);
    this.masterForm.controls['dgEnergy'].setValue(this.selPlannedEnergy.planedDGEnergy);
    this.masterForm.controls['dgRunHrs'].setValue(this.selPlannedEnergy.planedDGRunHrs);
    this.masterForm.controls['mdgEnergy'].setValue(this.selPlannedEnergy.planedMDGEnergy);
    this.masterForm.controls['mdgRunHrs'].setValue(this.selPlannedEnergy.planedMDGRunHrs);
    this.masterForm.controls['battDisEnergy'].setValue(this.selPlannedEnergy.planedBattDisEnergykwh);
    this.masterForm.controls['battRunHrs'].setValue(this.selPlannedEnergy.planedBattDisRunHrs);
    this.masterForm.controls['battChargingEnergy'].setValue(this.selPlannedEnergy.planedBattChargingEnergykwh);
    this.masterForm.controls['battChargingRunHrs'].setValue(this.selPlannedEnergy.planedBattChargingEnergyrunhrs);
    this.masterForm.controls['solarBattRunHrs'].setValue(this.selPlannedEnergy.planedSolarBattRunHrs);
    this.masterForm.controls['solarDGRunHrs'].setValue(this.selPlannedEnergy.planedSolarDGRunHrs);
    this.masterForm.controls['solarMDGRunHrs'].setValue(this.selPlannedEnergy.planedSolarMDGRunHrs);
    this.masterForm.controls['teleEnergy'].setValue(this.selPlannedEnergy.planedTeleEnergy);
    this.masterForm.controls['teleRunHrs'].setValue(this.selPlannedEnergy.planedTeleRunHrs);
    this.masterForm.controls['communityLoadEnergy'].setValue(this.selPlannedEnergy.planedCommunityLoadEnergy);
    this.masterForm.controls['communityLoadRunHrs'].setValue(this.selPlannedEnergy.planedCommunityLoadRunHrs);
    this.masterForm.controls['opco1'].setValue(this.selPlannedEnergy.planedOpco1kwh);
    this.masterForm.controls['opco1RunHrs'].setValue(this.selPlannedEnergy.planedOpco1runhrs);
    this.masterForm.controls['opco2'].setValue(this.selPlannedEnergy.planedOpco2kwh);
    this.masterForm.controls['opco2RunHrs'].setValue(this.selPlannedEnergy.planedOpco2runhrs);
    this.masterForm.controls['opco3'].setValue(this.selPlannedEnergy.planedOpco3kwh);
    this.masterForm.controls['opco3RunHrs'].setValue(this.selPlannedEnergy.planedOpco3runhrs);
    this.masterForm.controls['opco4'].setValue(this.selPlannedEnergy.planedOpco4kwh);
    this.masterForm.controls['opco4RunHrs'].setValue(this.selPlannedEnergy.planedOpco4runhrs);

    this.setSitecode(this.selPlannedEnergy);
  }

  loadSiteCode() {
    const url = ApiConstant.getSiteMasterData;
    this.httpClient.post(url, null).subscribe((data: any) => {
      if (data && data.siteMasterList && data.siteMasterList.length) {
        this.siteCodeList = data.siteMasterList;
        this.masterForm.controls['selSiteCode'].setValue(data.siteMasterList[0]);
      }
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading site core list!'
      });
    });
  }

  setSitecode(req: any) {
    for (let item of this.siteCodeList) {
      if (item.smSitecode === req.smSitecode) {
        this.masterForm.controls['selSiteCode'].setValue(item);
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
    const url = ApiConstant.savePlannedEnergyMasterData;
console.log(formData);
    let params: any = {
      'peSitecode': formData.selSiteCode.smSitecode,
      'peSolarOutputEnergy': formData.solarOutputEnergy,
      'peSolarRunHrs': formData.solarRunHrs,
      'peDgEnergy': formData.dgEnergy,
      'peDgRunHrs': formData.dgRunHrs,
      'peMdgEnergy': formData.mdgEnergy,
      'peMdgRunHrs': formData.mdgRunHrs,
      'peBattDisEnergy': formData.battDisEnergy,
      'peBattDisRunHrs': formData.battRunHrs,
      'peBattChargingEnergy': formData.battChargingEnergy,
      'peBattChargingEnergyRunhrs': formData.battChargingRunHrs,
      'peSolarBattRunHrs': formData.solarBattRunHrs,
      'peSolarDGRunHrs': formData.solarDGRunHrs,
      'peSolarMDGRunHrs': formData.solarMDGRunHrs,
      'peTeleEnergy': formData.teleEnergy,
      'peTeleRunHrs': formData.teleRunHrs,
      'peCommunityLoadEnergy': formData.communityLoadEnergy,
      'peCommunityLoadRunHrs': formData.communityLoadRunHrs,
      'peOpco1': formData.opco1,
      'peOpco1Runhrs': formData.opco1RunHrs,
      'peOpco2': formData.opco2,
      'peOpco2Runhrs': formData.opco2RunHrs,
      'peOpco3': formData.opco3,
      'peOpco3Runhrs': formData.opco3RunHrs,
      'peOpco4': formData.opco4,
      'peOpco4Runhrs': formData.opco4RunHrs,
      'username': 'harish1'
    };
     if (this.isForEdit) {
      params.peSitecodeOld = this.plannedEnergyId;
     }
  // console.log("params",params)

    this.httpClient.post(url, params).subscribe((data: any) => {
      this.isLoading = false;
      this.dialogRef.close(data);
      this.util.notification.success({
        title: 'Success',
        msg: 'Planned Energy details saved successfully...'
      });
    }, (err) => {
      this.isLoading = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while saving Planned Energy!'
      });
    });
    if (this.isForEdit && this.plannedEnergyId!=params.peSitecodeOld) {
      this.delete();
     }
  }

  delete(item?: any, i?: any) {
    var r = true;
    if (r) {
      this.httpClient.post(ApiConstant.deletePlannedEnergyMasterData + `?peSitecode=${this.plannedEnergyId}`, null).subscribe((data) => {
        //this.loadData();
      }, (err) => {
        this.util.notification.error({
          title: 'Error',
          msg: 'Error while saving Planned Energy!'
        });
      });
    }
  }


}

